export interface GenericJsonStateManagerInterface {
  initialize(): Promise<void>;
  loadConfig(): Promise<void>;
  loadAutomationDefinitions(): Promise<void>;
}
