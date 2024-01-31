import { faker } from '@faker-js/faker';
import { MapValueInterface } from './MapValueInterface';

interface Builder {
  default(): this;
  withJsonPathVal(jsonPathVal: string): this;
  withTargetStateName(targetStateName: string): this;
  build(): MapValueInterface;
}

export class MapValueInstructionBuilder implements Builder {
  private _instruction: MapValueInterface;

  public constructor(instruction?: MapValueInterface) {
    this._instruction = typeof instruction !== 'undefined' ? instruction : ({} as MapValueInterface);
  }

  public default(): this {
    this._instruction = {
      targetStateName: faker.helpers.fromRegExp(/adapter.[0-9]{1}.id_[0-9]{5}/),
      jsonPathVal: faker.helpers.fromRegExp(/path[0-9]{1}/),
    };
    return this;
  }

  public withJsonPathVal(jsonPathVal?: string): this {
    this._instruction.jsonPathVal = typeof jsonPathVal !== 'undefined' ? jsonPathVal : faker.word.verb();
    return this;
  }

  public withTargetStateName(targetStateName?: string): this {
    this._instruction.targetStateName = typeof targetStateName !== 'undefined' ? targetStateName : faker.word.verb();
    return this;
  }

  public build(): MapValueInterface {
    return this._instruction;
  }
}

export class MapValueInstructionFactory {
  public static instruction(instruction?: MapValueInterface): MapValueInterface {
    const builder =
      typeof instruction !== 'undefined'
        ? new MapValueInstructionBuilder(instruction)
        : new MapValueInstructionBuilder();
    return builder.default().build();
  }
}
