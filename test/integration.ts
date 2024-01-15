import { tests } from '@iobroker/testing';
import { TestHarness } from '@iobroker/testing/build/tests/integration/lib/harness';
import { use as chaiUse } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import path from 'path';

chaiUse(chaiAsPromised);

function delay(time: number | undefined) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function determineAdapterVersion(): string {
  if (process.argv.length < 3) {
    return 'latest';
  }
  const args = process.argv.slice(2);
  const controllerVersionArg = args.find((arg) => arg.startsWith('--controller-version='));
  return controllerVersionArg ? controllerVersionArg.split('=')[1] : 'latest';
}

// Borrowed from https://github.com/matthsc/ioBroker.gigaset-elements/blob/f6bcf4ec0391609ee5153b37fdf57f6351b8c392/test/integration.ts
// Run integration tests - See https://github.com/ioBroker/testing for a detailed explanation and further options
tests.integration(path.join(__dirname, '..'), {
  //            ~~~~~~~~~~~~~~~~~~~~~~~~~
  loglevel: 'debug',
  controllerVersion: determineAdapterVersion(),
  defineAdditionalTests({ suite }) {
    console.log('>>> Using controller version ' + this.controllerVersion + ' with log level ' + this.loglevel);
    // All tests (it, describe) must be grouped in one or more suites. Each suite sets up a fresh environment for the adapter tests.
    // At the beginning of each suite, the databases will be reset and the adapter will be started.
    // The adapter will run until the end of each suite.

    // Since the tests are heavily instrumented, each suite gives access to a so called "harness" to control the tests.
    suite('Adapter startup', function (getHarness) {
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

    // suite("test-data", function (getHarness) {
    //     describe("test-data", function () {
    //         this.timeout(5000);

    //         let harness: TestHarness;
    //         before(async () => {
    //             harness = getHarness();
    //             await harness.startAdapterAndWait();
    //         });

    //         // this doesn't seem to work in integration test, maybe because of the parallelism when creating states
    //         it("should be processed without throwing an error", async () => {
    //             await sendMessage(harness, "test", "process-test-data");
    //         });
    //     });
    // });
  },
});
