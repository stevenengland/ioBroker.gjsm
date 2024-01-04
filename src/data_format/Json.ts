import { DataFormatError } from './DataFormatError';
import { DataFormatInterface } from './DataFormatInterface';

export class Json implements DataFormatInterface {
  parse(data: unknown): unknown {
    try {
      if (typeof data !== 'string') {
        data = JSON.stringify(data);
      }
      const jsonObject: unknown = JSON.parse(data as string);
      return jsonObject;
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new DataFormatError('Invalid (JSON) syntax: ' + error.message);
      }
    }
  }

  hasCorrectDataFormat(data: unknown): boolean {
    try {
      if (typeof data !== 'string') {
        data = JSON.stringify(data);
      }
      const result = JSON.parse(data as string) as unknown;
      const type = Object.prototype.toString.call(result);
      return type === '[object Object]' || type === '[object Array]';
    } catch (err) {
      return false;
    }
  }
}
