import { expect } from 'chai';
import sinon from 'sinon';
import { ObjectClient } from '../../iob/ObjectClient';
import { ObjectInterface } from '../../iob/ObjectInterface';
import { StateFactory } from '../../iob/State.Factory.test';
import { JsonPath } from '../../json_path/JsonPath';
import { nameof } from '../../utils/NameOf';
import { ConfigInterfaceFactory } from '../configuration/ConfigInterface.Factory.test';
import { ConfigProvider } from '../configuration/ConfigProvider';
import { AutomationError } from './AutomationError';
import { AutomationSpecProcessor } from './AutomationSpecProcessor';
import { FilterType } from './FilterType';
import { ExecutionResult } from './instructions/ExecutionResult';
import { InstructionInterface } from './instructions/InstructionInterface';
import { InstructionInterfaceFactory } from './instructions/InstructionInterface.Factory.test';

describe(nameof(AutomationSpecProcessor), () => {
  let sut: AutomationSpecProcessor;
  const objectClientStub = sinon.createStubInstance(ObjectClient);
  const configProviderStub = sinon.createStubInstance(ConfigProvider);
  const jsonPathStub = sinon.createStubInstance(JsonPath);

  beforeEach(() => {
    sinon.stub(configProviderStub, 'config').value(ConfigInterfaceFactory.create());
    sut = new AutomationSpecProcessor(configProviderStub, objectClientStub, jsonPathStub);
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
      it(`Should throw automation error when function with id is not found`, async () => {
        // GIVEN
        objectClientStub.getForeignObjectAsync.resolves(null);
        // WHEN
        const when = async () => await sut.getFilteredSourceStates(FilterType.function, 'groupFilter', 'testName');
        // THEN
        await expect(when()).to.be.rejectedWith(AutomationError);
      });
      it(`Should return zero states when function object has no members`, async () => {
        // GIVEN
        objectClientStub.getForeignObjectAsync.resolves({ common: {} } as ObjectInterface);
        // WHEN
        const when = async () => await sut.getFilteredSourceStates(FilterType.function, 'groupFilter', 'testName');
        // THEN
        await expect(when()).to.be.rejectedWith(AutomationError);
      });
      it(`Should return filtered (duplicate free) states when filter type Function is given`, async () => {
        // GIVEN
        // Setting up the states by function gathering
        const finalStates = StateFactory.statesWithId(3, 'xyz.testName'); // --> not a state path
        const finalState = StateFactory.statesWithId(1, 'xyz.123.testName')[0]; // --> state path
        finalStates.push(StateFactory.state());
        finalStates.push(StateFactory.statesWithId(1, 'xyz.testName2')[0]);
        objectClientStub.getForeignObjectAsync.resolves({ common: { members: ['test', 'test2'] } } as ObjectInterface);
        objectClientStub.isObjectOfTypeState.onCall(0).resolves(false);
        objectClientStub.isObjectOfTypeState.onCall(1).resolves(true);
        objectClientStub.getForeignStateAsync.resolves(finalState);
        objectClientStub.getForeignStatesAsync.resolves(finalStates);
        // Setting up the filter by source state name
        objectClientStub.getStateName.onCall(0).returns('testName'); // --> Call for state xyz.testName
        objectClientStub.getStateName.onCall(3).returns('testName'); // --> Call for state xyz.123.testName
        // WHEN
        const result = await sut.getFilteredSourceStates(FilterType.function, 'groupFilter', 'testName');
        // THEN
        expect(result.length).to.equal(2);
        expect(result[0].id).to.equal('xyz.testName');
        expect(result[1].id).to.equal('xyz.123.testName');
      });
    },
  );
  describe(
    nameof<AutomationSpecProcessor>((s) => s.executeInstruction),
    () => {
      it(`Should fail if target state is not found`, async () => {
        // GIVEN
        // WHEN
        const result = await sut.executeInstruction(
          StateFactory.state(),
          InstructionInterfaceFactory.createMapValueInstruction(),
        );
        // const result = await sut.executeInstruction(StateFactory.state(), new MapValueInstruction());
        // THEN
        expect(result).to.equal(ExecutionResult.targetStateNotFound);
      });
      it(`Should fail if jsonpath for target value does not match`, async () => {
        // GIVEN
        objectClientStub.getForeignStateAsync.resolves(StateFactory.state());
        jsonPathStub.getValues.returns([]);
        // WHEN
        const result = await sut.executeInstruction(
          StateFactory.state(),
          InstructionInterfaceFactory.createMapValueInstruction(),
        );
        // const result = await sut.executeInstruction(StateFactory.state(), new MapValueInstruction());
        // THEN
        expect(result).to.equal(ExecutionResult.jsonPathNoMatch);
      });
      it(`Should set target state with new value`, async () => {
        // GIVEN
        const sourceState = StateFactory.state();
        const targetState = StateFactory.state();
        objectClientStub.getForeignStateAsync.resolves(targetState);
        jsonPathStub.getValues.returns(['testValue']);
        // WHEN
        const result = await sut.executeInstruction(
          sourceState,
          InstructionInterfaceFactory.createMapValueInstruction(),
        );
        // const result = await sut.executeInstruction(StateFactory.state(), new MapValueInstruction());
        // THEN
        expect(objectClientStub.setForeignStateAsync).calledOnceWithExactly(targetState);
        expect(result).to.equal(ExecutionResult.success);
      });
      it(`Should fail if instruction is not supported`, async () => {
        // GIVEN
        // WHEN
        const result = await sut.executeInstruction(StateFactory.state(), {} as InstructionInterface); // Since instruction is not created via constructor, instanceof will not recognize it.
        // THEN
        expect(result).to.equal(ExecutionResult.instructionNotImplemented);
      });
    },
  );
});
