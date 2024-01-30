/* eslint-disable @typescript-eslint/no-var-requires */
import { TestSuite } from '@iobroker/testing/build/tests/integration';
import { TestHarness } from '@iobroker/testing/build/tests/integration/lib/harness';
import { expect } from 'chai';
import path from 'path';
import { TestStateValueInterfaceFactory } from '../test_data/test_state_value/TestStateValueInterface.Factory.test';
import {
  StateChangeExpectation,
  delay,
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

      before(() => {
        harness = getHarness();
      });

      it('Should map JSON fields from source states to target states', async () => {
        // GIVEN
        await prepareDbEntities(harness, require('../test_data/scenario00') as NodeRequire);
        // Set value for a source state we know is subscribed and will be source for mapping.
        const sourceStateValue = TestStateValueInterfaceFactory.value();
        const promise = waitForStateChange(harness, 'test.0.test_folder.target_state_number', {
          newVal: sourceStateValue.numberValue,
        } as StateChangeExpectation);
        // WHEN
        await startAdapter(harness);
        await delay(1000);
        await setStateAsync(harness, 'test.0.test_folder.source_state', {
          val: JSON.stringify(sourceStateValue),
        });
        //await delay(5000);
        await promise;
        // THEN
        // Get the target state that should have received the mapped value
        const numberState = await getStateAsync(harness, 'test.0.test_folder.target_state_number');
        expect(numberState.val).to.equal(sourceStateValue.numberValue);
        //const boolState = await getStateAsync(harness, 'test.0.test_folder.target_state_boolean');
        //expect(boolState.val).to.equal(sourceStateValue.booleanValue);
        //const stringState = await getStateAsync(harness, 'test.0.test_folder.target_state_string');
        //expect(stringState.val).to.equal(sourceStateValue.stringValue);
      });
    });
  });
}

export default {};
