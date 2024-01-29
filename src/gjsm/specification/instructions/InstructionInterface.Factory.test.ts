import { faker } from '@faker-js/faker';
import { Instruction } from './Instruction';
import { MapValueInstruction } from './MapValueInstruction';
import { SetValueInstruction } from './SetValueInstruction';

interface Builder {
  defaultMapValueInstruction(): this;
  defaultSetValueInstruction(): this;
  withJsonPathVal(jsonPathVal: string): this;
  withTargetStateName(targetStateName: string): this;
  build(): Instruction;
}

export class InstructionInterfaceBuilder implements Builder {
  private _instruction: Instruction;

  public constructor(instruction?: Instruction) {
    this._instruction = typeof instruction !== 'undefined' ? instruction : ({} as Instruction);
  }

  public defaultMapValueInstruction(): this {
    this._instruction = {
      action: 'map_value',
      jsonPathVal: faker.word.verb(),
      targetStateName: faker.word.verb(),
    } as MapValueInstruction;
    return this;
  }

  public defaultSetValueInstruction(): this {
    this._instruction = {
      action: 'set_value',
      targetStateName: faker.word.verb(),
    } as SetValueInstruction;
    return this;
  }

  public withJsonPathVal(jsonPathVal: string): this {
    (this._instruction as MapValueInstruction).jsonPathVal =
      typeof jsonPathVal !== 'undefined' ? jsonPathVal : faker.word.verb();
    return this;
  }

  public withTargetStateName(targetStateName: string): this {
    this._instruction.targetStateName = typeof targetStateName !== 'undefined' ? targetStateName : faker.word.verb();
    return this;
  }

  public build() {
    return this._instruction;
  }
}

export class InsctructionInterfaceFactory {
  public static createMapValueInstruction(instruction?: Instruction): Instruction {
    const builder =
      typeof instruction !== 'undefined'
        ? new InstructionInterfaceBuilder(instruction)
        : new InstructionInterfaceBuilder();
    return builder.defaultMapValueInstruction().build();
  }

  public static createSetValueInstruction(instruction?: Instruction): Instruction {
    const builder =
      typeof instruction !== 'undefined'
        ? new InstructionInterfaceBuilder(instruction)
        : new InstructionInterfaceBuilder();
    return builder.defaultSetValueInstruction().build();
  }
}
