import { faker } from '@faker-js/faker';
import { MapValueInstruction } from './MapValueInstruction';

interface Builder {
  default(): this;
  build(): MapValueInstruction;
}

export class MapValueInstructionBuilder implements Builder {
  private _instruction: MapValueInstruction = new MapValueInstruction();

  public constructor(instruction?: MapValueInstruction) {
    this._instruction = typeof instruction !== 'undefined' ? instruction : ({} as MapValueInstruction);
  }

  public default(): this {
    this._instruction = new MapValueInstruction({
      targetStateName: faker.helpers.fromRegExp(/adapter.[0-9]{1}.id_[0-9]{5}/),
      jsonPathVal: faker.helpers.fromRegExp(/path[0-9]{1}/),
    });
    return this;
  }

  public build(): MapValueInstruction {
    return this._instruction;
  }
}

export class MapValueInstructionFactory {
  public static instruction(instruction?: MapValueInstruction): MapValueInstruction {
    const builder =
      typeof instruction !== 'undefined'
        ? new MapValueInstructionBuilder(instruction)
        : new MapValueInstructionBuilder();
    return builder.default().build();
  }
}
