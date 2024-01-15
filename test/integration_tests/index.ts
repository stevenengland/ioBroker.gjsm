import { TestSuite } from '@iobroker/testing/build/tests/integration';
import { runTests as startupTests } from './Startup.test';

export function runTests(suite: TestSuite) {
  startupTests(suite);
}
