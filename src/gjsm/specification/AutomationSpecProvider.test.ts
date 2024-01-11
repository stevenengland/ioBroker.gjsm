import { expect } from 'chai';
import sinon from 'sinon';
import { Json } from '../../data_format/Json';
import { Yaml } from '../../data_format/Yaml';
import { ObjectClient } from '../../iob/ObjectClient';
import { StateFactory } from '../../iob/State.Factory.test';
import { nameof } from '../../utils/NameOf';
import { ConfigInterface } from '../configuration/ConfigInterface';
import { ConfigProviderInterface } from '../configuration/ConfigProviderInterface';
import { AutomationSpecProvider } from './AutomationSpecProvider';

describe(nameof(AutomationSpecProvider), () => {
  let sut: AutomationSpecProvider;
  const yamlStub = sinon.createStubInstance(Yaml);
  const jsonStub = sinon.createStubInstance(Json);
  const objectClientStub = sinon.createStubInstance(ObjectClient);
  //const configProviderStub = sinon.createStubInstance(ConfigProvider); // When class contains no methods: "Error: Found no methods on object to which we could apply mutations"
  const configProviderStub = { config: {} as ConfigInterface } as ConfigProviderInterface;

  beforeEach(() => {
    sut = new AutomationSpecProvider(configProviderStub, objectClientStub, yamlStub, jsonStub);
  });
  afterEach(() => {
    sinon.reset();
  });
  describe('constructor', () => {
    it(`Should load schema file`, () => {
      // GIVEN
      // WHEN
      // THEN
      expect(sut.schema).not.to.be.undefined;
    });
  });
  describe(
    nameof<AutomationSpecProvider>((s) => s.loadSpecifications),
    () => {
      it(`Should load an item with error field filled given a invalid state value`, async () => {
        // GIVEN
        objectClientStub.getStatesAsync.resolves([StateFactory.createWithVal('invalid')]);
        // WHEN
        await sut.loadSpecifications();
        const result = sut.specifications[0]!.errors![0];
        // THEN
        expect(result).to.contain('The data format of');
      });
      it(`Should load a config given a JSON document`, async () => {
        // GIVEN
        objectClientStub.getStatesAsync.resolves([StateFactory.createWithVal("{ 'isJson': true }")]);
        jsonStub.hasCorrectDataFormat.returns(true);
        // WHEN
        await sut.loadSpecifications();
        const result = sut.specifications.length;
        // THEN
        expect(result).to.equal(1);
      });
      it(`Should load a config given a YAML document`, async () => {
        // GIVEN
        objectClientStub.getStatesAsync.resolves([StateFactory.createWithVal('isYaml: true ')]);
        yamlStub.hasCorrectDataFormat.returns(true);
        // WHEN
        await sut.loadSpecifications();
        const result = sut.specifications.length;
        // THEN
        expect(result).to.equal(1);
      });
    },
  );
});
