import { AutomationInterface } from './AutomationInterface';
import { FilterType } from './FilterType';

export interface AutomationSpecInterface {
  id?: string;
  errors?: string[];
  automations?: AutomationInterface[];
  groupFilter?: string;
  filterType?: FilterType;
}
