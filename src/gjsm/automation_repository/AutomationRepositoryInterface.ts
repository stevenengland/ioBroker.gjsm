import { InstructionInterface } from '../specification/instructions/InstructionInterface';

export interface AutomationRepositoryInterface {
  addAutomations(stateId: string, instructions: InstructionInterface[]): void;
  getAutomations(stateId: string): InstructionInterface[];
  deleteAllAutomations(): void;
}
