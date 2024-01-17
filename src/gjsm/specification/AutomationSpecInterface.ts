import { AutomationInterface } from './AutomationInterface';

export interface AutomationSpecInterface {
  id?: string;
  errors?: string[];
  automations?: AutomationInterface[];
}
