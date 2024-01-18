import { expect } from 'chai';
import sinon from 'sinon';
import { ObjectClient } from '../../iob/ObjectClient';
import { ObjectInterface } from '../../iob/ObjectInterface';
import { StateFactory } from '../../iob/State.Factory.test';
import { nameof } from '../../utils/NameOf';
import { ConfigInterfaceFactory } from '../configuration/ConfigInterface.Factory.test';
import { ConfigProvider } from '../configuration/ConfigProvider';
import { FilterType } from './FilterType';
import { SpecificationProcessor } from './SpecificationProcessor';

describe(nameof(SpecificationProcessor), () => {
  let sut: SpecificationProcessor;
  const objectClientStub = sinon.createStubInstance(ObjectClient);
  const configProviderStub = sinon.createStubInstance(ConfigProvider);
  sinon.stub(configProviderStub, 'config').value(ConfigInterfaceFactory.create());
  beforeEach(() => {
    sut = new SpecificationProcessor(configProviderStub, objectClientStub);
  });
  afterEach(() => {});
  describe(
    nameof<SpecificationProcessor>((s) => s.getFilteredStates),
    () => {
      it(`Should throw if filter type none was chosen`, async () => {
        // GIVEN
        // WHEN
        const when = async () => await sut.getFilteredStates(FilterType.none, 'groupFilter');
        // THEN
        await expect(when()).to.be.rejectedWith(Error);
      });
      it(`Should return zero states when function with id is not found`, async () => {
        // GIVEN
        objectClientStub.getForeignObjectAsync.resolves(null);
        // WHEN
        const result = await sut.getFilteredStates(FilterType.function, 'groupFilter');
        // THEN
        expect(result).to.be.empty;
      });
      it(`Should return zero states when function object has no members`, async () => {
        // GIVEN
        objectClientStub.getForeignObjectAsync.resolves({ common: {} } as ObjectInterface);
        // WHEN
        const result = await sut.getFilteredStates(FilterType.function, 'groupFilter');
        // THEN
        expect(result).to.be.empty;
      });
      it(`Should return filtered (duplicate free) states when filter type Function is given`, async () => {
        // GIVEN
        const finalStates = StateFactory.createMultiple(2);
        finalStates.push(StateFactory.createWithPrefixedId(1, 'id_')[0]);
        finalStates.push(StateFactory.createWithPrefixedId(1, 'id_')[0]);
        objectClientStub.getForeignObjectAsync.resolves({ common: { members: ['test'] } } as ObjectInterface);
        objectClientStub.getStatesAsync.resolves(finalStates);
        // WHEN
        const result = await sut.getFilteredStates(FilterType.function, 'groupFilter');
        // THEN
        expect(result.length).to.equal(3);
      });
    },
  );
});
