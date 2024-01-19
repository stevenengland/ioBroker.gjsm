import { Instruction } from './instructions/InstructionType';
export interface AutomationInterface {
  sourceStateName: string;
  instructions: Instruction[];
}
