import { faker } from '@faker-js/faker';
import { AutomationInterface } from './AutomationInterface';
import { InsctructionInterfaceFactory } from './instructions/Instruction.Factory.test';

interface Builder {
  default(): this;
  build(): AutomationInterface;
}

export class AutomationInterfaceBuilder implements Builder {
  private _spec: AutomationInterface;

  public constructor(config?: AutomationInterface) {
    this._spec = typeof config !== 'undefined' ? config : ({} as AutomationInterface);
  }

  public default(): this {
    this._spec = {
      sourceStateName: faker.word.verb(),
      instructions: [
        InsctructionInterfaceFactory.createMapValueInstruction(),
        InsctructionInterfaceFactory.createSetValueInstruction(),
      ],
    };
    return this;
  }

  public build() {
    return this._spec;
  }
}

export class AutomationInterfaceFactory {
  public static create(config?: AutomationInterface): AutomationInterface {
    const builder =
      typeof config !== 'undefined' ? new AutomationInterfaceBuilder(config) : new AutomationInterfaceBuilder();
    return builder.default().build();
  }
}
