import { faker } from '@faker-js/faker';
import { AutomationInterface } from './AutomationInterface';
import { AutomationType } from './AutomationType';

interface Builder {
  default(): this;
  build(): AutomationInterface;
}

export class AutomationInterfaceBuilder implements Builder {
  private spec: AutomationInterface;

  public constructor(config?: AutomationInterface) {
    this.spec = typeof config !== 'undefined' ? config : ({} as AutomationInterface);
  }

  public default(): this {
    this.spec = {
      automationType: faker.helpers.enumValue(AutomationType),
      sourceStateName: faker.word.verb(),
      mappings: [],
    };
    return this;
  }

  public build() {
    return this.spec;
  }
}

export class AutomationInterfaceFactory {
  public static create(config?: AutomationInterface): AutomationInterface {
    const builder =
      typeof config !== 'undefined' ? new AutomationInterfaceBuilder(config) : new AutomationInterfaceBuilder();
    return builder.default().build();
  }
}
