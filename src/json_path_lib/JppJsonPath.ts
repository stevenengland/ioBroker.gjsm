import { JSONPath } from 'jsonpath-plus';
import { JsonPathInterface } from './JsonPathInterface';

export class JppJsonPath implements JsonPathInterface {
  public getValues(jsonPath: string, json: string): unknown[] {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const jsonObject = JSON.parse(json);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const values = JSONPath({
      path: jsonPath,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      json: jsonObject,
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return values;
  }
}
