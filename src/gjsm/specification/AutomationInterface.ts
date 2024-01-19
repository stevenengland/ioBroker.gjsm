import { Instruction } from './instructions/Instruction';
export interface AutomationInterface {
  sourceStateName: string;
  instructions: Instruction[];
}
