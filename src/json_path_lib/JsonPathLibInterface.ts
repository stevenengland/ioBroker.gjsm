export interface JsonPathLibInterface {
    getValues(jsonPath: string, json: string): unknown[];
}
