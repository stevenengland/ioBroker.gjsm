import { faker } from '@faker-js/faker';
import { AutomationInterface } from './AutomationInterface';
import { AutomationInterfaceFactory } from './AutomationInterface.Factory.test';
import { AutomationSpecInterface } from './AutomationSpecInterface';
import { FilterType } from './FilterType';

interface Builder {
  default(): this;
  withFilterType(filterType: FilterType): this;
  withGroupFilter(groupFilter: string): this;
  withAutomations(automations: AutomationInterface[]): this;
  build(): AutomationSpecInterface;
}

export class AutomationSpecInterfaceBuilder implements Builder {
  private _spec: AutomationSpecInterface;

  public constructor(spec?: AutomationSpecInterface) {
    this._spec = typeof spec !== 'undefined' ? spec : ({} as AutomationSpecInterface);
  }

  public default(): this {
    this._spec = {
      automations: [AutomationInterfaceFactory.create()],
      filterType: faker.helpers.enumValue(FilterType),
      groupFilter: faker.word.verb(),
    };
    return this;
  }

  public withFilterType(filterType?: FilterType): this {
    this._spec.filterType = typeof filterType !== 'undefined' ? filterType : faker.helpers.enumValue(FilterType);
    return this;
  }

  public withGroupFilter(groupFilter?: string): this {
    this._spec.groupFilter = typeof groupFilter !== 'undefined' ? groupFilter : faker.word.verb();
    return this;
  }

  public withAutomations(automations?: AutomationInterface[]): this {
    this._spec.automations = typeof automations !== 'undefined' ? automations : [AutomationInterfaceFactory.create()];
    return this;
  }

  public build() {
    return this._spec;
  }
}

export class AutomationSpecInterfaceFactory {
  public static create(spec?: AutomationSpecInterface): AutomationSpecInterface {
    const builder =
      typeof spec !== 'undefined' ? new AutomationSpecInterfaceBuilder(spec) : new AutomationSpecInterfaceBuilder();
    return builder.default().build();
  }
}
