import { Instruction } from '../specification/instructions/Instruction';
import { AutomationRepositoryInterface } from './AutomationRepositoryInterface';

export class AutomationRepository implements AutomationRepositoryInterface {
  private readonly _automationMap: Map<string, Instruction[]> = new Map<string, Instruction[]>();

  public addAutomations(stateId: string, instructions: Instruction[]): void {
    if (this._automationMap.has(stateId)) {
      this._automationMap.get(stateId)?.push(...instructions);
    } else {
      this._automationMap.set(stateId, instructions);
    }
  }

  public getAutomations(stateId: string): Instruction[] {
    return this._automationMap.get(stateId) ?? [];
  }

  public deleteAllAutomations(): void {
    this._automationMap.clear();
  }
}
