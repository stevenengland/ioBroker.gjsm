import { expect } from 'chai';
import sinon from 'sinon';
import ioPackage from '../../../io-package.json';
import { Json } from '../../data_format/Json';
import { nameof } from '../../utils/NameOf';
import { ConfigProvider } from './ConfigProvider';

describe(nameof(ConfigProvider), () => {
  let sut: ConfigProvider;
  const jsonStub = sinon.createStubInstance(Json);
  const publicConfig = ioPackage.native;

  beforeEach(() => {
    sut = new ConfigProvider(publicConfig, jsonStub);
  });
  afterEach(() => {
    sinon.reset();
  });
  describe('constructor', () => {
    it(`Should load config`, () => {
      // GIVEN
      // WHEN
      // THEN
      expect(sut.config.instructionSetStatesPattern).to.not.be.undefined;
    });
    it(`Should populate schema`, () => {
      // GIVEN
      // WHEN
      // THEN
      expect(sut.schema).to.not.be.undefined;
    });
    it(`Should load config with schema validation`, () => {
      // GIVEN
      // WHEN
      function when() {
        sut = new ConfigProvider(publicConfig, new Json());
      }
      // THEN
      expect(when).not.to.throw();
    });
    it(`Should throw if config is invalid`, () => {
      // GIVEN
      jsonStub.validateAgainstSchema.throws(new Error('Invalid (JSON) syntax'));
      // WHEN
      function when() {
        sut = new ConfigProvider({}, jsonStub);
      }
      // THEN
      expect(when).to.throw(Error, /Invalid \(JSON\) syntax/);
    });
  });
});
