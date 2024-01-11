import { AutomationSpecInterface } from './AutomationSpecInterface';

export interface AutomationSpecProviderInterface {
  specifications: Array<AutomationSpecInterface>;
  schema: object;
  loadSpecifications(): Promise<void>;
}
