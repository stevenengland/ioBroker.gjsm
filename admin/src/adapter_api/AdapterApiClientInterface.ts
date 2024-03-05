export interface AdapterApiClientInterface {
  getAutomationsAsync(): Promise<string[]>;
}
