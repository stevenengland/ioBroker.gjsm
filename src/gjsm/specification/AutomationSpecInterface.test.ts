import { Json } from '../../data_format/Json';
import { AutomationSpecInterface } from './AutomationSpecInterface';
import { schema } from './AutomationSpecSchema';

describe('Automation specification', () => {
  let _json: Json;
  beforeEach(() => {
    _json = new Json();
  });
  describe('validation against schema', () => {
    it(`Should succeed`, async () => {
      // GIVEN
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires
      const rawSpecs: AutomationSpecInterface[] = require('../../../test/test_data/s_automations_for_validation.json');
      for (const rawSpec of rawSpecs) {
        const spec = rawSpec;
        // WHEN
        try {
          await _json.validateAgainstSchema(spec, schema);
        } catch (error) {
          console.log(`Spec: ${JSON.stringify(spec, null, 2)}`);
          throw error;
        }
      }
      // THEN
    });
  });
});
