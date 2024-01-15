import { TestSuite } from '@iobroker/testing/build/tests/integration';
import { TestHarness } from '@iobroker/testing/build/tests/integration/lib/harness';
import { delay } from './TestTools';

export function runTests(suite: TestSuite) {
  suite('Adapter startup', function (getHarness: () => TestHarness) {
    describe('', function () {
      this.timeout(5000);

      let harness: TestHarness;
      before(() => {
        harness = getHarness();
      });

      it('Should work', async () => {
        harness.on('stateChange', (id: string, state: ioBroker.State | null | undefined) => {
          console.log('>>> stateChange', id, state);
        });
        // Start the adapter and wait until it has started
        console.log('>>> Starting adapter...');
        await harness.startAdapterAndWait();
        console.log('>>> Started adapter...');

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        await harness.states.setStateAsync('gjsm.0.automations.test1', 1);
        await delay(100);
        return new Promise((resolve) => {
          console.log('>>> sending to...');
          resolve();
        });
      }).timeout(60000);
    });
  });
}

export default {};
