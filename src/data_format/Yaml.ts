import YAML from 'yaml';
import { DataFormatError } from './DataFormatError';
import { DataFormatInterface } from './DataFormatInterface';

export class Yaml implements DataFormatInterface {
  parse(data: string): unknown {
    try {
      const yamlObject: unknown = YAML.parse(data);
      return yamlObject;
    } catch (error) {
      throw new DataFormatError('Invalid YAML content: ' + (error as Error).message);
    }
  }
  hasCorrectDataFormat(data: unknown): boolean {
    if (typeof data !== 'string') return false;
    try {
      const result = YAML.parse(data) as unknown;
      const type = Object.prototype.toString.call(result);
      return type === '[object Object]' || type === '[object Array]';
    } catch (err) {
      return false;
    }
  }
}
