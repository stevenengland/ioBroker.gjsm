import { InstructionInterface } from '../specification/instructions/InstructionInterface';
import { AutomationRepositoryInterface } from './AutomationRepositoryInterface';

export class AutomationRepository implements AutomationRepositoryInterface {
  private readonly _automationMap: Map<string, InstructionInterface[]> = new Map<string, InstructionInterface[]>();

  public addAutomations(stateId: string, instructions: InstructionInterface[]): void {
    if (this._automationMap.has(stateId)) {
      this._automationMap.get(stateId)?.push(...instructions);
    } else {
      this._automationMap.set(stateId, instructions);
    }
  }

  public getAutomations(stateId: string): InstructionInterface[] {
    return this._automationMap.get(stateId) ?? [];
  }

  public deleteAllAutomations(): void {
    this._automationMap.clear();
  }
}
