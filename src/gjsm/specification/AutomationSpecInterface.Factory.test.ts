import { faker } from '@faker-js/faker';
import { AutomationInterfaceFactory } from './AutomationInterface.Factory.test';
import { AutomationSpecInterface } from './AutomationSpecInterface';
import { FilterType } from './FilterType';

interface Builder {
  default(): this;
  build(): AutomationSpecInterface;
}

export class AutomationSpecInterfaceBuilder implements Builder {
  private spec: AutomationSpecInterface;

  public constructor(config?: AutomationSpecInterface) {
    this.spec = typeof config !== 'undefined' ? config : ({} as AutomationSpecInterface);
  }

  public default(): this {
    this.spec = {
      automations: [AutomationInterfaceFactory.create()],
      filterType: faker.helpers.enumValue(FilterType),
      groupFilter: faker.word.verb(),
    };
    return this;
  }

  public build() {
    return this.spec;
  }
}

export class AutomationSpecInterfaceFactory {
  public static create(config?: AutomationSpecInterface): AutomationSpecInterface {
    const builder =
      typeof config !== 'undefined' ? new AutomationSpecInterfaceBuilder(config) : new AutomationSpecInterfaceBuilder();
    return builder.default().build();
  }
}
