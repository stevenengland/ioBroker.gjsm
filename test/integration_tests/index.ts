import { TestSuite } from '@iobroker/testing/build/tests/integration';
import { runTests as mapValueTests } from './MapValue.test';
import { runTests as startup } from './Startup.test';

export function runTests(suite: TestSuite) {
  startup(suite);
  mapValueTests(suite);
}
