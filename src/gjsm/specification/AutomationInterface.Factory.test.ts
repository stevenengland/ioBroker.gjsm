import { faker } from '@faker-js/faker';
import { AutomationInterface } from './AutomationInterface';
import { Instruction } from './instructions/Instruction';
import { InsctructionInterfaceFactory } from './instructions/InstructionInterface.Factory.test';

interface Builder {
  default(): this;
  withSourceStateName(sourceStateName: string): this;
  withInstructions(instructions: Instruction[]): this;
  build(): AutomationInterface;
}

export class AutomationInterfaceBuilder implements Builder {
  private _automation: AutomationInterface;

  public constructor(automation?: AutomationInterface) {
    this._automation = typeof automation !== 'undefined' ? automation : ({} as AutomationInterface);
  }

  public default(): this {
    this._automation = {
      sourceStateName: faker.word.verb(),
      instructions: [
        InsctructionInterfaceFactory.createMapValueInstruction(),
        InsctructionInterfaceFactory.createSetValueInstruction(),
      ],
    };
    return this;
  }

  public withSourceStateName(sourceStateName: string): this {
    this._automation.sourceStateName = typeof sourceStateName !== 'undefined' ? sourceStateName : faker.word.verb();
    return this;
  }
  public withInstructions(instructions: Instruction[]): this {
    this._automation.instructions =
      typeof instructions !== 'undefined'
        ? instructions
        : [
            InsctructionInterfaceFactory.createMapValueInstruction(),
            InsctructionInterfaceFactory.createSetValueInstruction(),
          ];
    return this;
  }

  public build() {
    return this._automation;
  }
}

export class AutomationInterfaceFactory {
  public static create(automation?: AutomationInterface): AutomationInterface {
    const builder =
      typeof automation !== 'undefined' ? new AutomationInterfaceBuilder(automation) : new AutomationInterfaceBuilder();
    return builder.default().build();
  }
}
