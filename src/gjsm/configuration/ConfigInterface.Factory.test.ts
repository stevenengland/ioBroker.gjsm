import { faker } from '@faker-js/faker';
import { ConfigInterface } from './ConfigInterface';

interface Builder {
  default(): this;
  build(): ConfigInterface;
}

export class ConfigInterfaceBuilder implements Builder {
  private _config: ConfigInterface;

  public constructor(config?: ConfigInterface) {
    this._config = typeof config !== 'undefined' ? config : ({} as ConfigInterface);
  }

  public default(): this {
    this._config = {
      automationNamespace: faker.helpers.fromRegExp(/adapter.[0-9]{1}.\*/),
      automationStatesPattern: faker.helpers.fromRegExp(/adapter.[0-9]{1}.\*/),
      functionsNamespace: faker.helpers.fromRegExp(/enum.functions/),
      createTargetStatesIfNotExist: faker.datatype.boolean(),
      instanceId: faker.number.int(),
      instanceName: faker.person.firstName(),
      infoNamespace: faker.helpers.fromRegExp(/info/),
      infoStateProcessAutomationReadyness: faker.helpers.fromRegExp(/processAutomationReadyness/),
    };
    return this;
  }

  public build() {
    return this._config;
  }
}

export class ConfigInterfaceFactory {
  public static create(config?: ConfigInterface): ConfigInterface {
    const builder = typeof config !== 'undefined' ? new ConfigInterfaceBuilder(config) : new ConfigInterfaceBuilder();
    return builder.default().build();
  }
}
