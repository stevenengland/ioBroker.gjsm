import { expect } from 'chai';
import sinon from 'sinon';
import { ObjectClient } from '../iob/ObjectClient';
import { ObjectType } from '../iob/types/ObjectType';
import { State } from '../iob/types/State';
import { StateFactory } from '../iob/types/State.Factory.test';
import { Logger } from '../logger/Logger';
import { nameof } from '../utils/NameOf';
import { GenericJsonStateManager } from './GenericJsonStateManager';
import { AutomationRepository } from './automation_repository/AutomationRepository';
import { ConfigInterfaceFactory } from './configuration/ConfigInterface.Factory.test';
import { ConfigProvider } from './configuration/ConfigProvider';
import { PublicConfigInterface } from './configuration/PublicConfigInterface';
import { CommandProcessor } from './message_api/CommandProcessor';
import { AutomationSpecInterface } from './specification/AutomationSpecInterface';
import { AutomationSpecInterfaceFactory } from './specification/AutomationSpecInterface.Factory.test';
import { AutomationSpecProcessor } from './specification/AutomationSpecProcessor';
import { AutomationSpecProvider } from './specification/AutomationSpecProvider';
import { ExecutionResult } from './specification/instructions/ExecutionResult';
import { InstructionInterface } from './specification/instructions/InstructionInterface';
import { InstructionInterfaceFactory } from './specification/instructions/InstructionInterface.Factory.test';

describe(nameof(GenericJsonStateManager), () => {
  let sut: GenericJsonStateManager;
  const specProviderStub = sinon.createStubInstance(AutomationSpecProvider);
  const specProcessorStub = sinon.createStubInstance(AutomationSpecProcessor);
  const loggerStub = sinon.createStubInstance(Logger);
  const configProviderStub = sinon.createStubInstance(ConfigProvider); // When class contains no methods: "Error: Found no methods on object to which we could apply mutations";
  const objectClientStub = sinon.createStubInstance(ObjectClient);
  const autoRepositoryStub = sinon.createStubInstance(AutomationRepository);
  const commandProcessorStub = sinon.createStubInstance(CommandProcessor);

  beforeEach(() => {
    sinon.stub(configProviderStub, 'config').value(ConfigInterfaceFactory.create());
    sinon.stub(specProviderStub, 'specifications').value([AutomationSpecInterfaceFactory.create()]);
    sut = new GenericJsonStateManager(
      loggerStub,
      configProviderStub,
      specProviderStub,
      specProcessorStub,
      objectClientStub,
      autoRepositoryStub,
      commandProcessorStub,
    );
  });

  afterEach(() => {
    sinon.reset();
  });

  describe(
    nameof<GenericJsonStateManager>((g) => g.initialize),
    () => {
      it(`Should load configuration`, async () => {
        // GIVEN
        // WHEN
        await sut.initialize();
        // THEN
        expect(configProviderStub.loadConfig).calledOnce;
      });
      it(`Should subscribe to automation states`, async () => {
        // GIVEN
        // WHEN
        await sut.initialize();
        // THEN
        expect(objectClientStub.subscribeStatesAsync).calledOnceWithExactly(
          configProviderStub.config.automationStatesPattern,
        );
      });
      it(`Should subscribe to config objects`, async () => {
        // GIVEN
        // WHEN
        await sut.initialize();
        // THEN
        expect(objectClientStub.subscribeForeignObjectsAsync).calledOnceWithExactly(
          'system.adapter.' + configProviderStub.config.instanceName + '.' + configProviderStub.config.instanceId,
        );
      });
    },
  );

  describe(
    nameof<GenericJsonStateManager>((g) => g.terminate),
    () => {
      it(`Should set info state`, async () => {
        // GIVEN
        // WHEN
        await sut.terminate();
        // THEN
        expect(objectClientStub.setStateAsync).calledWithMatch({
          id:
            configProviderStub.config.infoNamespace +
            '.' +
            configProviderStub.config.infoStateProcessAutomationReadyness,
          val: false,
        } as State);
      });
    },
  );

  describe(
    nameof<GenericJsonStateManager>((g) => g.loadConfig),
    () => {
      it(`Should load configuration`, async () => {
        // GIVEN
        // WHEN
        await sut.loadConfig();
        // THEN
        expect(configProviderStub.loadConfig).calledOnce;
      });
      it(`Should handle error`, async () => {
        // GIVEN
        configProviderStub.loadConfig.throws(new Error('test'));
        sut.errorEmitter.on('error', (error, additionalData) => {
          expect(additionalData?.isCritical).to.be.true;
          expect(error.message).to.equal('test');
        });
        // WHEN
        await sut.loadConfig();
        // THEN
      });
    },
  );

  describe(
    nameof<GenericJsonStateManager>((g) => g.loadAutomationDefinitions),
    () => {
      it(`Should load automation sets`, async () => {
        // GIVEN
        sinon.stub(specProviderStub, 'specifications').value([{}] as AutomationSpecInterface[]);
        // WHEN
        await sut.loadAutomationDefinitions();
        // THEN
        expect(specProviderStub.loadSpecifications).calledOnce;
        expect(loggerStub.info).calledWithMatch(/definition\(s\) loaded/);
      });
      it(`Should handle when there is no automation specification found`, async () => {
        // GIVEN
        sinon.stub(specProviderStub, 'specifications').value([] as AutomationSpecInterface[]);
        // WHEN
        await sut.loadAutomationDefinitions();
        // THEN
        expect(specProviderStub.loadSpecifications).calledOnce;
        expect(loggerStub.warn).calledWithMatch(/No automation/); // Actually nothing to do, but we want to know
      });
      it(`Should catch errors when spec loading throws`, async () => {
        // GIVEN
        specProviderStub.loadSpecifications.throws(new Error('test'));
        // WHEN
        await sut.loadAutomationDefinitions();
        // THEN
        expect(loggerStub.error).calledWithMatch(/test/);
      });
      it(`Should report if automation definition loaded with errors`, async () => {
        // GIVEN
        sinon
          .stub(specProviderStub, 'specifications')
          .value([{ errors: ['test1', 'test2'] }, { errors: ['test3'] }] as AutomationSpecInterface[]);
        // WHEN
        await sut.loadAutomationDefinitions();
        // THEN
        expect(loggerStub.warn).calledWithMatch('test1');
        expect(loggerStub.warn).calledWithMatch('test2');
        expect(loggerStub.warn).calledWithMatch('test3');
      });
    },
  );

  describe(
    nameof<GenericJsonStateManager>((g) => g.createSubscriptionsAndRepositoryForSourceStates),
    () => {
      it(`Should subscribe to states`, async () => {
        // GIVEN
        const states = StateFactory.statesWithPrefixedId(3, 'id_');
        specProcessorStub.getFilteredSourceStates.resolves(states);
        // WHEN
        await sut.createSubscriptionsAndRepositoryForSourceStates();
        // THEN
        expect(objectClientStub.subscribeForeignStatesAsync).calledWith('id_0');
        expect(objectClientStub.subscribeForeignStatesAsync).calledWith('id_1');
        expect(objectClientStub.subscribeForeignStatesAsync).calledWith('id_2');
      });
      it(`Should add items to automation repository`, async () => {
        // GIVEN
        const states = StateFactory.statesWithPrefixedId(3, 'id_');
        specProcessorStub.getFilteredSourceStates.resolves(states);
        // WHEN
        await sut.createSubscriptionsAndRepositoryForSourceStates();
        // THEN
        expect(autoRepositoryStub.addAutomations).called;
      });
      it(`Should log occuring exceptions`, async () => {
        // GIVEN
        specProcessorStub.getFilteredSourceStates.throws(new Error('test'));
        // WHEN
        await sut.createSubscriptionsAndRepositoryForSourceStates();
        // THEN
        expect(loggerStub.warn).calledWithMatch(/test/);
      });
      it(`Should clear the repository`, async () => {
        // GIVEN
        // WHEN
        await sut.createSubscriptionsAndRepositoryForSourceStates();
        // THEN
        expect(autoRepositoryStub.deleteAllAutomations).calledOnce;
      });
      it(`Should set info state to false and true again`, async () => {
        // GIVEN
        const states = StateFactory.statesWithPrefixedId(3, 'id_');
        specProcessorStub.getFilteredSourceStates.resolves(states);
        // WHEN
        await sut.createSubscriptionsAndRepositoryForSourceStates();
        // THEN
        expect(objectClientStub.setStateAsync)
          .calledWithMatch({
            id:
              configProviderStub.config.infoNamespace +
              '.' +
              configProviderStub.config.infoStateProcessAutomationReadyness,
            val: false,
          } as State)
          .calledWithMatch({
            id:
              configProviderStub.config.infoNamespace +
              '.' +
              configProviderStub.config.infoStateProcessAutomationReadyness,
            val: true,
          } as State);
      });
    },
  );
  describe(
    nameof<GenericJsonStateManager>((g) => g.handleStateChange),
    () => {
      it(`Should subscribe to states`, async () => {
        // GIVEN
        autoRepositoryStub.getAutomations.returns([
          InstructionInterfaceFactory.createMapValueInstruction(),
          InstructionInterfaceFactory.createMapValueInstruction(),
        ]);
        // WHEN
        await sut.handleStateChange('test', StateFactory.state());
        // THEN
        expect(specProcessorStub.executeInstruction).calledTwice;
      });
      it(`Should log if exutoion of instruction fails`, async () => {
        // GIVEN
        autoRepositoryStub.getAutomations.returns([InstructionInterfaceFactory.createMapValueInstruction()]);
        specProcessorStub.executeInstruction.throws(new Error('test'));
        // WHEN
        await sut.handleStateChange('test', StateFactory.state());
        // THEN
        expect(loggerStub.warn).calledWithMatch(/test/);
      });
      it(`Should reload automation definitions`, async () => {
        // GIVEN
        const states = StateFactory.statesWithPrefixedId(3, 'id_');
        specProcessorStub.getFilteredSourceStates.resolves(states);
        // WHEN
        await sut.handleStateChange(
          configProviderStub.config.instanceName +
            '.' +
            configProviderStub.config.instanceId +
            '.' +
            configProviderStub.config.automationNamespace,
          StateFactory.state(),
        );
        // THEN
        expect(specProviderStub.loadSpecifications).calledOnce;
        expect(autoRepositoryStub.deleteAllAutomations).calledOnce;
        expect(autoRepositoryStub.addAutomations).called;
      });
      it(`Should handle execution results`, async () => {
        // GIVEN
        autoRepositoryStub.getAutomations.onCall(0).returns([{} as InstructionInterface]);
        autoRepositoryStub.getAutomations.returns([InstructionInterfaceFactory.createMapValueInstruction()]);
        specProcessorStub.executeInstruction.onCall(0).resolves(ExecutionResult.instructionNotImplemented);
        specProcessorStub.executeInstruction.onCall(1).resolves(ExecutionResult.success);
        specProcessorStub.executeInstruction.onCall(2).resolves(ExecutionResult.jsonPathNoMatch);
        specProcessorStub.executeInstruction.onCall(3).resolves(ExecutionResult.targetStateNotFound);
        specProcessorStub.executeInstruction.onCall(4).resolves(ExecutionResult.targetStateCreateAliasNotSupported);
        specProcessorStub.executeInstruction.onCall(5).resolves(ExecutionResult.sourceValueFormatNotSupported);
        // WHEN
        await sut.handleStateChange('test', StateFactory.state());
        await sut.handleStateChange('test', StateFactory.state());
        await sut.handleStateChange('test', StateFactory.state());
        await sut.handleStateChange('test', StateFactory.state());
        await sut.handleStateChange('test', StateFactory.state());
        await sut.handleStateChange('test', StateFactory.state());
        await sut.handleStateChange('test', StateFactory.state()); // unexpected result
        // THEN
        expect(loggerStub.debug).calledWithMatch(/executed/);
        expect(loggerStub.warn).calledWithMatch(/implemented/);
        expect(loggerStub.warn).calledWithMatch(/JSON path/);
        expect(loggerStub.warn).calledWithMatch(/found no target state/);
        expect(loggerStub.warn).calledWithMatch(/alias/);
        expect(loggerStub.warn).calledWithMatch(/format/);
      });
    },
  );
  describe(
    nameof<GenericJsonStateManager>((g) => g.handleObjectChange),
    () => {
      it(`Should load config`, async () => {
        // GIVEN
        const config = { createTargetStatesIfNotExist: true } as PublicConfigInterface;
        // WHEN
        await sut.handleObjectChange(
          'system.adapter.' + configProviderStub.config.instanceName + '.' + configProviderStub.config.instanceId,
          { native: config } as ObjectType,
        );
        // THEN
        expect(configProviderStub.loadConfig).calledOnceWithExactly(config);
      });
    },
  );
  describe(
    nameof<GenericJsonStateManager>((g) => g.handleMessage),
    () => {
      it(`Should return error if processing command throws`, async () => {
        // GIVEN
        commandProcessorStub.processCommand.throws(new Error('test'));
        // WHEN
        const result = await sut.handleMessage('getAutomationNames');
        // THEN
        expect(result.error).to.contain('test');
      });
      it(`Should return automation state names`, async () => {
        // GIVEN
        const payload = ['test'];
        commandProcessorStub.processCommand.resolves({ payload: payload });
        // WHEN
        const result = await sut.handleMessage('getAutomationNames');
        // THEN
        expect(result.payload).to.equal(payload);
      });
    },
  );
});
