import { AutomationSpecInterface } from './AutomationSpecInterface';

export interface AutomationSpecProviderInterface {
  specifications: AutomationSpecInterface[];
  schema: object;
  loadSpecifications(): Promise<void>;
}
