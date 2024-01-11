import { expect } from 'chai';
import sinon from 'sinon';
import { Logger } from '../logger/Logger';
import { nameof } from '../utils/NameOf';
import { GenericJsonStateManager } from './GenericJsonStateManager';
import { ConfigProvider } from './configuration/ConfigProvider';
import { AutomationSpecInterface } from './specification/AutomationSpecInterface';
import { AutomationSpecProvider } from './specification/AutomationSpecProvider';

describe(nameof(GenericJsonStateManager), () => {
  let sut: GenericJsonStateManager;
  const specProviderStub = sinon.createStubInstance(AutomationSpecProvider);
  const loggerStub = sinon.createStubInstance(Logger);
  const configProviderStub = sinon.createStubInstance(ConfigProvider); // When class contains no methods: "Error: Found no methods on object to which we could apply mutations";

  beforeEach(() => {
    sut = new GenericJsonStateManager(loggerStub, configProviderStub, specProviderStub);
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
        expect(loggerStub.info).calledWithMatch(/successfully/);
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
});
