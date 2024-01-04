import { DataFormatError } from './DataFormatError';
import { DataFormatInterface } from './DataFormatInterface';

export class Json implements DataFormatInterface {
  parse(data: string): unknown {
    try {
      const jsonObject: unknown = JSON.parse(data);
      return jsonObject;
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new DataFormatError('Invalid (JSON) syntax: ' + error.message);
      }
    }
  }

  hasCorrectDataFormat(data: unknown): boolean {
    if (typeof data !== 'string') return false;
    try {
      const result = JSON.parse(data) as unknown;
      const type = Object.prototype.toString.call(result);
      return type === '[object Object]' || type === '[object Array]';
    } catch (err) {
      return false;
    }
  }
}
