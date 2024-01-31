import { faker } from '@faker-js/faker';
import { TestStateValueInterface } from './TestStateValueInterface';

interface Builder {
  default(): this;
  build(): TestStateValueInterface;
}

export class TestStateValueInterfaceBuilder implements Builder {
  private _value: TestStateValueInterface;

  public constructor(value?: TestStateValueInterface) {
    this._value = typeof value !== 'undefined' ? value : ({} as TestStateValueInterface);
  }

  public default(): this {
    this._value = {
      numberValue: faker.number.int({ min: 100, max: 1000 }),
      stringValue: faker.word.noun(),
      booleanValue: false,
    };
    return this;
  }

  public build() {
    return this._value;
  }
}

export class TestStateValueInterfaceFactory {
  public static value(value?: TestStateValueInterface): TestStateValueInterface {
    const builder =
      typeof value !== 'undefined' ? new TestStateValueInterfaceBuilder(value) : new TestStateValueInterfaceBuilder();
    return builder.default().build();
  }
}
