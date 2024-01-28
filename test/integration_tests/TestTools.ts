import { TestHarness } from '@iobroker/testing/build/tests/integration/lib/harness';
import fs from 'fs';
import { StateInterface } from '../../src/iob/StateInterface';

export function delay(time: number | undefined) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export async function getStateAsync(harness: TestHarness, id: string): Promise<StateInterface> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  return await harness.states.getStateAsync(id);
}

export async function setStateAsync(
  harness: TestHarness,
  id: string,
  state: Partial<StateInterface>,
  ack = true,
): Promise<StateInterface> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  return await harness.states.setStateAsync(id, state, ack);
}

export async function insertObjectsToDb(harness: TestHarness, objects: ioBroker.Object[]) {
  for (const obj of objects) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await harness.objects.setObjectAsync(obj._id, obj);
  }
}

export async function insertStatesToDb(harness: TestHarness, states: Record<string, ioBroker.State>) {
  for (const id in states) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await harness.states.setStateAsync(id, { val: states[id] });
  }
}

export async function startAdapter(harness: TestHarness) {
  console.log('Starting adapter...');
  const promises = [
    harness.startAdapterAndWait(),
    // waitForStateChange('lovelace.0.info.readyForClients', harness)
  ];
  await Promise.all(promises);
  console.log('Started adapter...');
}

export function readTestStatesFromDir(directoryPath: string): Record<string, ioBroker.State> {
  const jsonFileNames: string[] = [];
  const tsFileNames: string[] = [];
  const states: Record<string, ioBroker.State> = {};

  // JSON files
  fs.readdirSync(directoryPath).forEach((file) => {
    if (file.endsWith('.json') && file.startsWith('s_')) {
      jsonFileNames.push(file);
    }
  });

  for (const fileName of jsonFileNames) {
    const filePath = `${directoryPath}/${fileName}`;
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const fileObjects: Record<string, ioBroker.State>[] = JSON.parse(fileContent) as Record<string, ioBroker.State>[];

    fileObjects.forEach((fileObject) => {
      Object.keys(fileObject).forEach((key) => {
        states[key] = fileObject[key];
      });
    });
  }

  // TS files
  fs.readdirSync(directoryPath).forEach((file) => {
    if (file.endsWith('.ts') && file.startsWith('s_')) {
      tsFileNames.push(file);
    }
  });

  for (const fileName of tsFileNames) {
    const filePath = `${directoryPath}/${fileName}`;
    // const fileContent = fs.readFileSync(filePath, 'utf8');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
    const module = require(filePath);
    // 2. Zweites TS File mit gleichem export (states oder default) konsumieren -> Muss ich vorher deregistrieren? https://github.com/nodejs/help/issues/2751
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    module.states.forEach((state: StateInterface) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      states[state.id] = { val: state.val, ack: state.ack, ts: state.ts } as ioBroker.State;
    });
  }

  // A few last corrections
  for (const key in states) {
    if (typeof states[key].val === 'object') {
      states[key].val = JSON.stringify(states[key].val);
    }
  }

  return states;
}

export function readTestObjectsFromDir(directoryPath: string): ioBroker.Object[] {
  const fileNames: string[] = [];
  const objects: ioBroker.Object[] = [];

  fs.readdirSync(directoryPath).forEach((file) => {
    if (file.endsWith('.json') && file.startsWith('o_')) {
      fileNames.push(file);
    }
  });

  for (const fileName of fileNames) {
    const filePath = `${directoryPath}/${fileName}`;
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const fileObjects = JSON.parse(fileContent) as ioBroker.Object[];
    for (const fileObject of fileObjects) {
      objects.push(fileObject);
    }
  }

  return objects;
}

export function getDbEntities(req: NodeRequire): [ioBroker.Object[], Record<string, ioBroker.State>] {
  // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const entities = JSON.parse(JSON.stringify(req));
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const iobObjects: ioBroker.Object[] = entities.iobObjects;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const iobStates: Record<string, ioBroker.State> = entities.iobStates;

  return [iobObjects, iobStates];
}

export async function prepareDbEntities(harness: TestHarness, req: NodeRequire) {
  const [iobObjects, iobStates] = getDbEntities(req);

  await insertObjectsToDb(harness, iobObjects);
  await insertStatesToDb(harness, iobStates);
}
