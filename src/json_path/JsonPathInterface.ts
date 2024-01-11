export interface JsonPathInterface {
  getValues(jsonPath: string, json: string): unknown[];
}
