import { TestSuite } from '@iobroker/testing/build/tests/integration';
import { runTests as integrationTestTools } from './IntegrationTestTools.test';
import { runTests as startup } from './Startup.test';

export function runTests(suite: TestSuite) {
  startup(suite);
  integrationTestTools(suite);
}
