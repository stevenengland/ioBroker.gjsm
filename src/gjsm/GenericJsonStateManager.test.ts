import { expect } from 'chai';
import sinon from 'sinon';
import { ObjectClient } from '../iob/ObjectClient';
import { Logger } from '../logger/Logger';
import { nameof } from '../utils/NameOf';
import { GenericJsonStateManager } from './GenericJsonStateManager';
import { ConfigInterfaceFactory } from './configuration/ConfigInterface.Factory.test';
import { ConfigProvider } from './configuration/ConfigProvider';
import { AutomationSpecInterface } from './specification/AutomationSpecInterface';
import { AutomationSpecProvider } from './specification/AutomationSpecProvider';
import { SpecificationProcessor } from './specification/SpecificationProcessor';

describe(nameof(GenericJsonStateManager), () => {
  let sut: GenericJsonStateManager;
  const specProviderStub = sinon.createStubInstance(AutomationSpecProvider);
  const specProcessorStub = sinon.createStubInstance(SpecificationProcessor);
  const loggerStub = sinon.createStubInstance(Logger);
  const configProviderStub = sinon.createStubInstance(ConfigProvider); // When class contains no methods: "Error: Found no methods on object to which we could apply mutations";
  const objectClientStub = sinon.createStubInstance(ObjectClient);
  sinon.stub(configProviderStub, 'config').value(ConfigInterfaceFactory.create());

  beforeEach(() => {
    sut = new GenericJsonStateManager(
      loggerStub,
      configProviderStub,
      specProviderStub,
      specProcessorStub,
      objectClientStub,
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
      it(`Should subscribe to config states`, async () => {
        // GIVEN
        // WHEN
        await sut.initialize();
        // THEN
        expect(objectClientStub.subscribeStatesAsync).calledOnce;
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
    nameof<GenericJsonStateManager>((g) => g.processAutomationDefinitions),
    () => {
      it(`Should load automation sets`, async () => {
        // GIVEN
        // WHEN
        await sut.processAutomationDefinitions();
        // THEN
      });
    },
  );
});
