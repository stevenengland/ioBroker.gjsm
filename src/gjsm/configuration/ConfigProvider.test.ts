import { expect } from 'chai';
import sinon from 'sinon';
import ioPackage from '../../../io-package.json';
import { Json } from '../../data_format/Json';
import { ObjectClient } from '../../iob/ObjectClient';
import { nameof } from '../../utils/NameOf';
import { ConfigError } from './ConfigError';
import { ConfigProvider } from './ConfigProvider';
import { InstanceConfigInterface } from './InstanceConfigInterface';

describe(nameof(ConfigProvider), () => {
  let sut: ConfigProvider;
  const jsonStub = sinon.createStubInstance(Json);
  const publicConfig = ioPackage.native;
  const objectClientStub = sinon.createStubInstance(ObjectClient);
  const instanceConfig = { instanceId: 'testId', instanceName: 'testName' } as unknown as InstanceConfigInterface;

  beforeEach(() => {
    sut = new ConfigProvider(jsonStub, instanceConfig, objectClientStub);
  });
  afterEach(() => {
    sinon.reset();
  });
  describe('constructor', () => {
    it(`Should populate schema`, () => {
      // GIVEN
      // WHEN
      // THEN
      expect(sut.schema).to.not.be.undefined;
    });
  });
  describe(
    nameof<ConfigProvider>((c) => c.loadConfig),
    () => {
      it(`Should load and validate config`, async () => {
        // GIVEN
        objectClientStub.getForeignObjectAsync.resolves({ native: publicConfig });
        sut = new ConfigProvider(new Json(), instanceConfig, objectClientStub);
        // WHEN
        await sut.loadConfig();
        // THEN
        // Something from every config part
        expect(sut.config.instructionSetStatesPattern).to.not.be.undefined; // private
        expect(sut.config.instanceId).to.not.be.undefined; // instance
        expect(sut.config.createTargetStatesIfNotExist).to.not.be.undefined; // public
      });
      it(`Should throw if adapter config cannot be read`, async () => {
        // GIVEN
        objectClientStub.getForeignObjectAsync.resolves(null);
        // WHEN
        async function when() {
          return sut.loadConfig();
        }
        // THEN
        await expect(when()).to.be.rejectedWith(ConfigError, /adapter config/);
      });
      it(`Should throw if config is invalid`, async () => {
        // GIVEN
        objectClientStub.getForeignObjectAsync.resolves({ native: publicConfig });
        jsonStub.validateAgainstSchema.throws(new Error('Invalid (JSON) syntax'));
        sut = new ConfigProvider(jsonStub, instanceConfig, objectClientStub);
        // WHEN
        async function when() {
          return sut.loadConfig();
        }
        // THEN
        await expect(when()).to.be.rejectedWith(Error, /Invalid \(JSON\) syntax/);
      });
    },
  );
});
