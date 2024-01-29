import { InstructionInterface } from './instructions/InstructionInterface';
export interface AutomationInterface {
  sourceStateName: string;
  instructions: InstructionInterface[];
}
