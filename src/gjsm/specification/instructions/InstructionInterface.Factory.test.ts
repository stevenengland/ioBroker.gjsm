import { faker } from '@faker-js/faker';
import { InstructionInterface } from './InstructionInterface';
import { MapValueInterface } from './MapValueInterface';
import { SetValueInterface } from './SetValueInterface';

interface Builder {
  defaultMapValueInstruction(): this;
  defaultSetValueInstruction(): this;
  withName(name: string): this;
  withMapValue(mapValue: InstructionInterface['map_value']): this;
  withSetValue(setValue: InstructionInterface['set_value']): this;
  build(): InstructionInterface;
}

export class InstructionInterfaceBuilder implements Builder {
  private _instruction: InstructionInterface;

  public constructor(instruction?: InstructionInterface) {
    this._instruction = typeof instruction !== 'undefined' ? instruction : ({} as InstructionInterface);
  }

  public defaultMapValueInstruction(): this {
    this._instruction = {
      name: faker.word.verb(),
      map_value: {
        jsonPathVal: faker.word.verb(),
        targetStateName: faker.word.verb(),
      },
    };
    return this;
  }

  public defaultSetValueInstruction(): this {
    this._instruction = {
      name: faker.word.verb(),
      set_value: {
        targetStateName: faker.word.verb(),
      },
    };
    return this;
  }

  public withName(name: string): this {
    this._instruction.name = typeof name !== 'undefined' ? name : faker.word.verb();
    return this;
  }

  public withMapValue(mapValue: MapValueInterface): this {
    this._instruction.map_value = mapValue;
    return this;
  }

  public withSetValue(setValue: SetValueInterface): this {
    this._instruction.set_value = setValue;
    return this;
  }

  public build() {
    return this._instruction;
  }
}

export class InstructionInterfaceFactory {
  public static createMapValueInstruction(instruction?: InstructionInterface): InstructionInterface {
    const builder =
      typeof instruction !== 'undefined'
        ? new InstructionInterfaceBuilder(instruction)
        : new InstructionInterfaceBuilder();
    return builder.defaultMapValueInstruction().build();
  }

  public static createSetValueInstruction(instruction?: InstructionInterface): InstructionInterface {
    const builder =
      typeof instruction !== 'undefined'
        ? new InstructionInterfaceBuilder(instruction)
        : new InstructionInterfaceBuilder();
    return builder.defaultSetValueInstruction().build();
  }
}
