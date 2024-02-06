/* eslint-disable @typescript-eslint/no-var-requires */
import { TestSuite } from '@iobroker/testing/build/tests/integration';
import { TestHarness } from '@iobroker/testing/build/tests/integration/lib/harness';
import { expect } from 'chai';
import path from 'path';
import { PublicConfigInterface } from '../../src/gjsm/configuration/PublicConfigInterface';
import { TestStateValueInterfaceFactory } from '../test_data/test_state_value/TestStateValueInterface.Factory.test';
import {
  StateChangeExpectation,
  changeAdapterConfigVars,
  getObjectAsync,
  getStateAsync,
  prepareDbEntities,
  setStateAsync,
  startAdapter,
  waitForStateChange,
} from './TestTools';

export function runTests(suite: TestSuite) {
  suite(path.parse(__filename).name.split('.')[0], function (getHarness: () => TestHarness) {
    describe('Adapter', function () {
      this.timeout(60000);

      let harness: TestHarness;
      let configVars: PublicConfigInterface;

      before(async () => {
        harness = getHarness();
        await prepareDbEntities(harness, require('../test_data/scenario00') as NodeRequire);
        await startAdapter(harness);
        configVars = (await getObjectAsync(harness, 'system.adapter.' + harness.adapterName + '.0'))
          .native as PublicConfigInterface;
      });

      afterEach(async () => {
        await changeAdapterConfigVars(harness, configVars);
      });

      it('Should map JSON fields from source states to existing target states', async () => {
        // GIVEN
        // await prepareDbEntities(harness, require('../test_data/scenario00') as NodeRequire);
        // Set value for a source state we know is subscribed and will be source for mapping.
        const sourceStateValue = TestStateValueInterfaceFactory.value();
        const promises = [
          waitForStateChange(harness, 'test.0.test_folder.target_state_number', {
            newVal: sourceStateValue.numberValue,
          } as StateChangeExpectation),
          waitForStateChange(harness, 'test.0.test_folder.target_state_boolean', {
            newVal: sourceStateValue.booleanValue,
          } as StateChangeExpectation),
          waitForStateChange(harness, 'test.0.test_folder.target_state_string', {
            newVal: sourceStateValue.stringValue,
          } as StateChangeExpectation),
        ];
        // WHEN
        // await startAdapter(harness);
        await setStateAsync(harness, 'test.0.test_folder.source_state', {
          val: JSON.stringify(sourceStateValue),
        });
        await Promise.all(promises);
        // THEN
        // Get the target state that should have received the mapped value
        const numberState = await getStateAsync(harness, 'test.0.test_folder.target_state_number');
        expect(numberState.val).to.equal(sourceStateValue.numberValue);
        const boolState = await getStateAsync(harness, 'test.0.test_folder.target_state_boolean');
        expect(boolState.val).to.equal(sourceStateValue.booleanValue);
        const stringState = await getStateAsync(harness, 'test.0.test_folder.target_state_string');
        expect(stringState.val).to.equal(sourceStateValue.stringValue);
      });

      it('Should map JSON fields from source states to NOT existing target states', async () => {
        // GIVEN
        // await prepareDbEntities(harness, require('../test_data/scenario00') as NodeRequire);
        // Set value for a source state we know is subscribed and will be source for mapping.
        const sourceStateValue = TestStateValueInterfaceFactory.value();
        const promises = [
          waitForStateChange(
            harness,
            'test.0.test_folder.target_state_number__that_does_not_exist_and_needs_to_be_created',
            {
              newVal: sourceStateValue.numberValue,
            } as StateChangeExpectation,
          ),
        ];
        // WHEN
        // await startAdapter(harness);
        await changeAdapterConfigVars(harness, {
          createTargetStatesIfNotExist: true,
        } as PublicConfigInterface); // Set createTargetStatesIfNotExist to true
        await setStateAsync(harness, 'test.0.test_folder.source_state', {
          val: JSON.stringify(sourceStateValue),
        });
        await Promise.all(promises);
        // THEN
        // Get the target state that should have received the mapped value
        const numberState = await getStateAsync(
          harness,
          'test.0.test_folder.target_state_number__that_does_not_exist_and_needs_to_be_created',
        );
        expect(numberState.val).to.equal(sourceStateValue.numberValue);
      });
    });
  });
}

export default {};
