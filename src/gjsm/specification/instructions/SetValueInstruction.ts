import { InstructionBaseInterface } from './InstructionBaseInterface';

export class SetValueInstruction implements InstructionBaseInterface {
  public name?: string;
  public targetStateName!: string;

  public constructor(instruction?: SetValueInstruction | Partial<SetValueInstruction>) {
    Object.assign(this, instruction);
  }
}
