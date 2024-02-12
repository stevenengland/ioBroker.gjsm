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
      it('should return a CommandResultInterface', async function () {
        // GIVEN
        objectClientStub.getStatesAsync.resolves(StateFactory.statesWithPrefixedId(3, 'id_'));
        // WHEN
        const result = await sut.processCommand(Command.getAutomationNames);
        // THEN
        expect((result.payload as string[]).length).to.equal(3);
      });
    },
  );
});
