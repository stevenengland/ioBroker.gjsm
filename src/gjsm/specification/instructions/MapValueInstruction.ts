import { InstructionBaseInterface } from './InstructionBaseInterface';

export class MapValueInstruction implements InstructionBaseInterface {
  public name?: string;
  public targetStateName!: string;
  public jsonPathVal!: string;

  public constructor(instruction?: MapValueInstruction | Partial<MapValueInstruction>) {
    Object.assign(this, instruction);
  }
}
