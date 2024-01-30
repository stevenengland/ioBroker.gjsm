import { tests } from '@iobroker/testing';
import { use as chaiUse } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { cleanTestArtifactsFromNpmCache } from './integration_tests/TestTools';
import { runTests } from './integration_tests/index';

chaiUse(chaiAsPromised);

function determineAdapterVersion(): string {
  if (process.argv.length < 3) {
    return 'latest';
  }
  const args = process.argv.slice(2);
  const controllerVersionArg = args.find((arg) => arg.startsWith('--controller-version='));
  return controllerVersionArg ? controllerVersionArg.split('=')[1] : 'latest';
}

function cleanTmpDir() {
  const tmpDir = path.join(os.tmpdir(), `test-iobroker.gjsm`, 'node_modules', 'iobroker.gjsm');
  if (fs.existsSync(tmpDir)) {
    console.log('Deleting ' + tmpDir);
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

// Borrowed from https://github.com/matthsc/ioBroker.gigaset-elements/blob/f6bcf4ec0391609ee5153b37fdf57f6351b8c392/test/integration.ts
// Run integration tests - See https://github.com/ioBroker/testing for a detailed explanation and further options
tests.integration(path.join(__dirname, '..'), {
  //            ~~~~~~~~~~~~~~~~~~~~~~~~~
  loglevel: 'debug',
  controllerVersion: determineAdapterVersion(),
  defineAdditionalTests({ suite }) {
    cleanTmpDir();
    cleanTestArtifactsFromNpmCache();
    console.log('>>> Using controller version ' + this.controllerVersion + ' with log level ' + this.loglevel);
    // All tests (it, describe) must be grouped in one or more suites. Each suite sets up a fresh environment for the adapter tests.
    // At the beginning of each suite, the databases will be reset and the adapter will be started.
    // The adapter will run until the end of each suite.
    runTests(suite);
  },
});
