import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { addEntryToMap, readJsonlFile, writeMapToJsonlFile } from './integration_tests/JsonLinesDbTools';
import { cleanTestArtifactsFromNpmCache, getDbEntities } from './integration_tests/TestTools';

const config = {
  devServerProfile: '',
  resetEnv: '',
  devServerDir: detectDevServerDir(__filename, 3),
  devServerProfileDir: '',
  skip: '',
  dbPreparationOnly: '',
  testDataDir: '',
  testDataFrom: '',
};

function checkAndCompleteConfig() {
  console.log('>>> Checking and completing config...');
  if (!config.devServerDir) {
    throw new Error('dev-server directory not found.');
  }
  config.devServerProfileDir = path.join(config.devServerDir, config.devServerProfile);
  config.testDataDir = path.join(config.devServerDir, '..', 'test', 'test_data');
  console.log('Using config:');
  console.log(JSON.stringify(config, null, 2));
}

function determineCliArgs(): void {
  console.log('>>> Determining CLI args...');
  if (process.argv.length < 3) {
    console.log('No arguments specified, assuming defaults.');
  }

  // profile
  const args = process.argv.slice(2);
  // skip (testrunners won't know that flag and will not cause this script to be executed every time a test runner re-explores the tests)?
  const skip = args.find((arg) => arg.startsWith('--skip='));
  config.skip = skip ? skip.split('=')[1] : 'true';
  // reset environment?
  const resetEnv = args.find((arg) => arg.startsWith('--reset_env='));
  config.resetEnv = resetEnv ? resetEnv.split('=')[1] : 'false';
  // run db preparation only?
  const dbPreparationOnly = args.find((arg) => arg.startsWith('--db_only='));
  config.dbPreparationOnly = dbPreparationOnly ? dbPreparationOnly.split('=')[1] : 'false';
  // profile
  const devServerProfile = args.find((arg) => arg.startsWith('--profile='));
  config.devServerProfile = devServerProfile ? devServerProfile.split('=')[1] : 'integration';
  // test data
  const testDataFrom = args.find((arg) => arg.startsWith('--tests_from='));
  config.testDataFrom = testDataFrom ? testDataFrom.split('=')[1] : 'scenario00';
}

function resetEnvironment(): void {
  console.log('>>> Resetting environment...');
  if (fs.existsSync(config.devServerProfileDir)) {
    console.log('Deleting profile directory found at:', config.devServerProfileDir);
    fs.rmSync(config.devServerProfileDir, { recursive: true, force: true });
  }
}

function detectDevServerDir(filePath: string, maxDepth: number): string | null {
  let currentDir = path.dirname(filePath);
  let depth = 0;

  while (depth < maxDepth) {
    const devServerDir = path.join(currentDir, '.dev-server');
    const ioPackageJson = path.join(currentDir, 'io-package.json');

    if (fs.existsSync(devServerDir)) {
      return devServerDir;
    }

    if (fs.existsSync(ioPackageJson)) {
      return null;
    }

    currentDir = path.dirname(currentDir);
    depth++;
  }

  return null;
}

async function buildProfile(): Promise<void> {
  console.log('>>> Building profile...');
  await startProcessAndKillAfterPattern('dev-server', ['setup', config.devServerProfile], undefined, 300);
}

async function setupProfile(): Promise<void> {
  console.log('>>> Setting up profile...');
  if (config.resetEnv === 'true' || !fs.existsSync(config.devServerProfileDir)) {
    resetEnvironment();
    await buildProfile();
  } else {
    console.log('Not resetting the environment but uploading the recent state of source.');
    await startProcessAndKillAfterPattern('dev-server', ['upload', config.devServerProfile]);
  }
}

async function fillDatabase(): Promise<void> {
  console.log('>>> Filling database...');
  let statesMap = readJsonlFile(path.join(config.devServerProfileDir, 'iobroker-data', 'states.jsonl'));
  let objectsMap = readJsonlFile(path.join(config.devServerProfileDir, 'iobroker-data', 'objects.jsonl'));

  if (!statesMap || !objectsMap) {
    console.log('No states or objects found. Starting server to create them.');
    await startProcessAndKillAfterPattern(
      'dev-server',
      ['run', config.devServerProfile],
      'Admin is now reachable under',
    );
    objectsMap = readJsonlFile(path.join(config.devServerProfileDir, 'iobroker-data', 'objects.jsonl'));
    statesMap = readJsonlFile(path.join(config.devServerProfileDir, 'iobroker-data', 'states.jsonl'));
    if (!statesMap || !objectsMap) {
      throw new Error('States or objects still not found after starting the server.');
    }
  }

  console.log(`Found ${statesMap.size} states and ${objectsMap.size} objects, injecting data ...`);
  const requirePath = path.join(config.testDataDir, config.testDataFrom);
  if (!fs.existsSync(requirePath)) {
    throw new Error(`Test data not found at ${requirePath}`);
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-var-requires
  const [iobObjects, iobStates] = getDbEntities(require(requirePath));
  console.log(`Injecting ${iobObjects.length} objects and ${Object.keys(iobStates).length} states...`);
  for (const obj of iobObjects) {
    addEntryToMap(objectsMap, obj._id, obj);
  }

  for (const id of Object.keys(iobStates)) {
    addEntryToMap(statesMap, id, iobStates[id]);
  }

  writeMapToJsonlFile(path.join(config.devServerProfileDir, 'iobroker-data', 'objects.jsonl'), objectsMap);
  writeMapToJsonlFile(path.join(config.devServerProfileDir, 'iobroker-data', 'states.jsonl'), statesMap);
}

async function startProcessAndKillAfterPattern(
  command: string,
  args: string[],
  pattern?: string,
  timeout = 120,
): Promise<number | null> {
  const process = spawn(command, args, { timeout: timeout * 1000 });

  return new Promise((resolve) => {
    process.stdout.on('data', (data: Buffer) => {
      const output: string = data.toString();

      // Check if the output contains the specified pattern
      if (pattern && output.includes(pattern)) {
        console.log(`Pattern "${pattern}" found in output. Killing the process.`);
        process.kill();
        resolve(0);
      }

      // Print the output
      console.log(output);
    });

    process.stderr.on('data', (data: Buffer) => {
      // Print any error output
      console.error(data.toString());
    });

    process.on('close', (code) => {
      console.log(`Process exited with code ${code}`);
      resolve(code);
    });
  });
}

async function main() {
  determineCliArgs();

  checkAndCompleteConfig();

  if (config.skip === 'true') {
    console.log('Skipping dev-server integration because skip flag is set.');
    return;
  }

  if (config.dbPreparationOnly !== 'true') {
    cleanTestArtifactsFromNpmCache();
    await setupProfile();
  }

  await fillDatabase();
}

// Run
void main();
