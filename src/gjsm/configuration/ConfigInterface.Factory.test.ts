import { faker } from '@faker-js/faker';
import { ConfigInterface } from './ConfigInterface';

interface Builder {
  default(): this;
  build(): ConfigInterface;
}

export class ConfigInterfaceBuilder implements Builder {
  private config: ConfigInterface;

  public constructor(config?: ConfigInterface) {
    this.config = typeof config !== 'undefined' ? config : ({} as ConfigInterface);
  }

  public default(): this {
    this.config = {
      automationStatesPattern: faker.helpers.fromRegExp(/adapter.[0-9]{1}.\*/),
      createTargetStatesIfNotExist: faker.datatype.boolean(),
      instanceId: faker.datatype.number(),
      instanceName: faker.name.firstName(),
    };
    return this;
  }

  public build() {
    return this.config;
  }
}

export class ConfigInterfaceFactory {
  public static create(config?: ConfigInterface): ConfigInterface {
    const builder = typeof config !== 'undefined' ? new ConfigInterfaceBuilder(config) : new ConfigInterfaceBuilder();
    return builder.build();
  }
}
