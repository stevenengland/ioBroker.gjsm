/* eslint-disable @typescript-eslint/no-var-requires */
import { TestSuite } from '@iobroker/testing/build/tests/integration';
import { TestHarness } from '@iobroker/testing/build/tests/integration/lib/harness';
import { expect } from 'chai';
import path from 'path';
import { StateInterface } from '../../src/iob/StateInterface';
import { delay, getStateAsync, prepareDbEntities, startAdapter } from './TestTools';

export function runTests(suite: TestSuite) {
  suite(path.parse(__filename).name.split('.')[0], function (getHarness: () => TestHarness) {
    describe('Should set and get objects/states', function () {
      this.timeout(5000);

      let harness: TestHarness;

      before(async () => {
        harness = getHarness();
        await startAdapter(harness);
      });

      it('Should map JSON fields from source states to target states', async () => {
        await prepareDbEntities(harness, require('../test_data/scenario01') as NodeRequire);
        const state: StateInterface = await getStateAsync(
          harness,
          'mqtt.0.smarthome.smartplug.tasmota_3E6EDD.tele.INFO2',
        );
        expect(state.val).to.have.property('Info2');
        await delay(100);
        return new Promise((resolve) => {
          resolve();
        });
      });
    });
  });
}

export default {};
