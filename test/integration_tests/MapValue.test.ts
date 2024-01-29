/* eslint-disable @typescript-eslint/no-var-requires */
import { TestSuite } from '@iobroker/testing/build/tests/integration';
import { TestHarness } from '@iobroker/testing/build/tests/integration/lib/harness';
import { expect } from 'chai';
import path from 'path';
import { AutomationInterfaceBuilder } from '../../src/gjsm/specification/AutomationInterface.Factory.test';
import { AutomationSpecInterfaceBuilder } from '../../src/gjsm/specification/AutomationSpecInterface.Factory.test';
import { FilterType } from '../../src/gjsm/specification/FilterType';
import { InstructionBuilder } from '../../src/gjsm/specification/instructions/Instruction.Factory.test';
import { TestStateValueInterfaceFactory } from '../test_data/test_state_value/TestStateValueInterface.Factory.test';
import { delay, getStateAsync, prepareDbEntities, setStateAsync, startAdapter } from './TestTools';

export function runTests(suite: TestSuite) {
  suite(path.parse(__filename).name.split('.')[0], function (getHarness: () => TestHarness) {
    describe('Adapter', function () {
      this.timeout(5000);

      let harness: TestHarness;
      const automationSpecBuilder = new AutomationSpecInterfaceBuilder();
      const automationBuilder = new AutomationInterfaceBuilder();
      const instructionBuilder = new InstructionBuilder();

      before(() => {
        harness = getHarness();
      });

      it('Should map JSON fields from source states to target states', async () => {
        // GIVEN
        await prepareDbEntities(harness, require('../test_data/scenario00') as NodeRequire);
        const automationSpec = automationSpecBuilder
          .withFilterType(FilterType.function)
          .withGroupFilter('test_function')
          .withAutomations([
            automationBuilder
              .withSourceStateName('source_state')
              .withInstructions([
                instructionBuilder
                  .defaultMapValueInstruction()
                  .withJsonPathVal('$.numberValue')
                  .withTargetStateName('target_state_number')
                  .build(),
              ])
              .build(),
          ])
          .build();
        await setStateAsync(harness, 'gjsm.0.automations.test_automation', {
          val: JSON.stringify(automationSpec),
        });
        // const myAutomation = await getStateAsync(harness, 'gjsm.0.automations.test_automation');
        // Set value for a source state we know is subscribed and will be source for mapping.
        const sourceStateValue = TestStateValueInterfaceFactory.value();
        // WHEN
        await startAdapter(harness);
        await delay(3000);
        await setStateAsync(harness, 'test.0.test_folder.source_state', {
          val: JSON.stringify(sourceStateValue),
        });
        // THEN
        // Get the target state that should have received the mapped value
        const numberState = await getStateAsync(harness, 'test.0.test_folder.target_state_number');
        expect(numberState.val).to.equal(sourceStateValue.numberValue);
        const boolState = await getStateAsync(harness, 'test.0.test_folder.target_state_boolean');
        expect(boolState.val).to.equal(sourceStateValue.booleanValue);
        const stringState = await getStateAsync(harness, 'test.0.test_folder.target_state_string');
        expect(stringState.val).to.equal(sourceStateValue.stringValue);
      });
    });
  });
}

export default {};
