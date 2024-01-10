// TODO: Make it TS: https://github.com/matthsc/ioBroker.gigaset-elements/blob/f6bcf4ec0391609ee5153b37fdf57f6351b8c392/test/integration.ts
// TODO: DevServer integration test
const path = require('path');
const { tests } = require('@iobroker/testing');

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

// Run tests
tests.integration(path.join(__dirname, '..'), {
  // Define your own tests inside defineAdditionalTests
  defineAdditionalTests({ suite }) {
    suite('Test sendTo()', (getHarness) => {
      let harness;
      before(() => {
        harness = getHarness();
      });

      // eslint-disable-next-line no-undef
      it('Should work', async () => {
        // Start the adapter and wait until it has started
        console.log('>>> Starting adapter...');
        await harness.startAdapterAndWait();
        console.log('>>> Started adapter...');
        return async (resolve) => {
          console.log('>>> sending to...');
          await delay(5000);
          resolve();
          //harness.sendTo('hm-rpc.0', 'test', 'message', (resp) => {
          //  console.dir(resp);
          //  resolve();
          //});
        };
      }).timeout(60000);
      // eslint-disable-next-line no-undef
      it('Should work', async () => {
        // Start the adapter and wait until it has started
        console.log('>>> Starting adapter...');
        await harness.startAdapterAndWait();
        console.log('>>> Started adapter...');
        return new Promise((resolve) => {
          console.log('>>> sending to...');
          resolve();
          //harness.sendTo('hm-rpc.0', 'test', 'message', (resp) => {
          //  console.dir(resp);
          //  resolve();
          //});
        });
      }).timeout(60000);
    });
  },
});
