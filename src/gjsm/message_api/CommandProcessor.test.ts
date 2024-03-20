import { expect } from 'chai';
import sinon from 'sinon';
import { ObjectClient } from '../../iob/ObjectClient';
import { StateFactory } from '../../iob/types/State.Factory.test';
import { nameof } from '../../utils/NameOf';
import { ConfigInterfaceFactory } from '../configuration/ConfigInterface.Factory.test';
import { ConfigProvider } from '../configuration/ConfigProvider';
import { Command } from './Command';
import { CommandProcessor } from './CommandProcessor';

describe(nameof(CommandProcessor), function () {
  let sut: CommandProcessor;
  const objectClientStub = sinon.createStubInstance(ObjectClient);
  const configProviderStub = sinon.createStubInstance(ConfigProvider);

  beforeEach(function () {
    sut = new CommandProcessor(objectClientStub, configProviderStub);
    sinon.stub(configProviderStub, 'config').value(ConfigInterfaceFactory.create());
  });

  afterEach(function () {
    sinon.reset();
  });

  describe(
    nameof<CommandProcessor>((c) => c.processCommand),
    function () {
      it(`should process ${Command.getAutomationNames}`, async function () {
        // GIVEN
        objectClientStub.getStatesAsync.resolves(StateFactory.statesWithPrefixedId(3, 'id_'));
        // WHEN
        const result = await sut.processCommand(Command.getAutomationNames);
        // THEN
        expect((result.payload as string[]).length).to.equal(3);
      });
      it(`should process ${Command.getAutomations}`, async function () {
        // GIVEN
        const states = StateFactory.statesWithPrefixedId(3, 'id_');
        objectClientStub.getStatesAsync.resolves(states);
        // WHEN
        const result = (await sut.processCommand(Command.getAutomations)) as { payload: Record<string, string> };
        // THEN
        expect(Object.keys(result.payload).length).to.equal(3);
        expect(result.payload[states[0].id]).to.equal(states[0].val);
      });
    },
  );
});
