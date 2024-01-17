import { AutomationType } from './AutomationType';
import { MappingInterface } from './MappingInterface'; // Import the missing MappingInterface type
export interface AutomationInterface {
  automationType: AutomationType;
  sourceStateName: string;
  mappings: MappingInterface[];
}
