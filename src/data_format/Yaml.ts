import YAML from 'yaml';
import { DataFormatError } from './DataFormatError';
import { DataFormatInterface } from './DataFormatInterface';

export class Yaml implements DataFormatInterface {
  parse(data: unknown): unknown {
    try {
      if (typeof data !== 'string') {
        data = YAML.stringify(data);
      }
      const yamlObject: unknown = YAML.parse(data as string);
      return yamlObject;
    } catch (error) {
      throw new DataFormatError('Invalid YAML content: ' + (error as Error).message);
    }
  }
  hasCorrectDataFormat(data: unknown): boolean {
    try {
      if (typeof data !== 'string') {
        data = YAML.stringify(data);
      }
      const result = YAML.parse(data as string) as unknown;
      const type = Object.prototype.toString.call(result);
      return type === '[object Object]' || type === '[object Array]';
    } catch (err) {
      return false;
    }
  }

  //validateAgainstSchema(data: unknown, schema: object): boolean {
  //  const ajv = new Ajv();
  //  data = data as string;
  //  const isValid = ajv.validate(schema, data);
  //  if (ajv.errors?.length ?? 0 > 0) {
  //    throw new DataFormatError('Invalid YAML content: ' + ajv.errorsText());
  //  }
  //  return isValid;
  //}
}
