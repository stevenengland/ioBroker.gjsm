import { Instruction } from '../specification/instructions/Instruction';

export interface AutomationRepositoryInterface {
  addAutomations(stateId: string, instructions: Instruction[]): void;
  getAutomations(stateId: string): Instruction[];
  deleteAllAutomations(): void;
}
