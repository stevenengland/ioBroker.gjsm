import { faker } from '@faker-js/faker';
import { Instruction } from './Instruction';
import { MapValueInterface } from './MapValueInterface';
import { SetValueInterface } from './SetValueInterface';

interface Builder {
  defaultMapValueInstruction(): this;
  defaultSetValueInstruction(): this;
  build(): Instruction;
}

export class InstructionInterfaceBuilder implements Builder {
  private _instruction: Instruction;

  public constructor(instruction?: Instruction) {
    this._instruction = typeof instruction !== 'undefined' ? instruction : ({} as Instruction);
  }

  public defaultMapValueInstruction(): this {
    this._instruction = {
      jsonPathVal: faker.word.verb(),
      targetStateName: faker.word.verb(),
    } as MapValueInterface;
    return this;
  }

  public defaultSetValueInstruction(): this {
    this._instruction = {
      targetStateName: faker.word.verb(),
    } as SetValueInterface;
    return this;
  }

  public build() {
    return this._instruction;
  }
}

export class InsctructionInterfaceFactory {
  public static createMapValueInstruction(config?: Instruction): Instruction {
    const builder =
      typeof config !== 'undefined' ? new InstructionInterfaceBuilder(config) : new InstructionInterfaceBuilder();
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
