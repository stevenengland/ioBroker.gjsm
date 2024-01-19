import { expect } from 'chai';
import sinon from 'sinon';
import { ObjectClient } from '../../iob/ObjectClient';
import { ObjectInterface } from '../../iob/ObjectInterface';
import { StateFactory } from '../../iob/State.Factory.test';
import { nameof } from '../../utils/NameOf';
import { ConfigInterfaceFactory } from '../configuration/ConfigInterface.Factory.test';
import { ConfigProvider } from '../configuration/ConfigProvider';
import { AutomationSpecProcessor } from './AutomationSpecProcessor';
import { FilterType } from './FilterType';

describe(nameof(AutomationSpecProcessor), () => {
  let sut: AutomationSpecProcessor;
  const objectClientStub = sinon.createStubInstance(ObjectClient);
  const configProviderStub = sinon.createStubInstance(ConfigProvider);

  beforeEach(() => {
    sinon.stub(configProviderStub, 'config').value(ConfigInterfaceFactory.create());
    sut = new AutomationSpecProcessor(configProviderStub, objectClientStub);
  });

  afterEach(() => {
    sinon.reset();
  });

  describe(
    nameof<AutomationSpecProcessor>((s) => s.getFilteredSourceStates),
    () => {
      it(`Should throw if filter type none was chosen`, async () => {
        // GIVEN
        // WHEN
        const when = async () => await sut.getFilteredSourceStates(FilterType.none, 'groupFilter', 'testName');
        // THEN
        await expect(when()).to.be.rejectedWith(Error);
      });
      it(`Should return zero states when function with id is not found`, async () => {
        // GIVEN
        objectClientStub.getForeignObjectAsync.resolves(null);
        // WHEN
        const result = await sut.getFilteredSourceStates(FilterType.function, 'groupFilter', 'testName');
        // THEN
        expect(result).to.be.empty;
      });
      it(`Should return zero states when function object has no members`, async () => {
        // GIVEN
        objectClientStub.getForeignObjectAsync.resolves({ common: {} } as ObjectInterface);
        // WHEN
        const result = await sut.getFilteredSourceStates(FilterType.function, 'groupFilter', 'testName');
        // THEN
        expect(result).to.be.empty;
      });
      it(`Should return filtered (duplicate free) states when filter type Function is given`, async () => {
        // GIVEN
        const finalStates = StateFactory.statesWithId(3, 'xyz.testName');
        finalStates.push(StateFactory.state());
        finalStates.push(StateFactory.statesWithId(1, 'xyz.testName2')[0]);
        objectClientStub.getForeignObjectAsync.resolves({ common: { members: ['test'] } } as ObjectInterface);
        objectClientStub.getStatesAsync.resolves(finalStates);
        objectClientStub.getStateName.onCall(0).returns('testName');
        // WHEN
        const result = await sut.getFilteredSourceStates(FilterType.function, 'groupFilter', 'testName');
        // THEN
        expect(result.length).to.equal(1);
        result.forEach((state) => {
          expect(state.id).to.equal('xyz.testName');
        });
      });
    },
  );
});
