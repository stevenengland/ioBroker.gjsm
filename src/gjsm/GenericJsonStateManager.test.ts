import sinon from 'sinon';
import { Logger } from '../logger/Logger';
import { nameof } from '../utils/NameOf';
import { GenericJsonStateManager } from './GenericJsonStateManager';
import { ConfigProvider } from './configuration/ConfigProvider';
import { SpecificationProvider } from './specification/SpecificationProvider';

describe(nameof(GenericJsonStateManager), () => {
  let sut: GenericJsonStateManager;
  const specProviderMock = sinon.createStubInstance(SpecificationProvider);
  const loggerMock = sinon.createStubInstance(Logger);
  const configProviderStub = sinon.createStubInstance(ConfigProvider); // When class contains no methods: "Error: Found no methods on object to which we could apply mutations";

  beforeEach(() => {
    sut = new GenericJsonStateManager(loggerMock, configProviderStub, specProviderMock);
  });
  afterEach(() => {
    sinon.reset();
  });
  describe(
    nameof<GenericJsonStateManager>((g) => g.initialize),
    () => {
      it(`Should load an item with error field filled given a invalid state value`, async () => {
        // GIVEN
        // WHEN
        await sut.initialize();
        // THEN
      });
    },
  );
});
