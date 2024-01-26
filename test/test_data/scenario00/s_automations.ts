import { AutomationInterfaceBuilder } from '../../../src/gjsm/specification/AutomationInterface.Factory.test';
import { AutomationSpecInterfaceBuilder } from '../../../src/gjsm/specification/AutomationSpecInterface.Factory.test';
import { FilterType } from '../../../src/gjsm/specification/FilterType';
import { InstructionInterfaceBuilder } from '../../../src/gjsm/specification/instructions/InstructionInterface.Factory.test';
import { State } from '../../../src/iob/State';
import { StateInterface } from '../../../src/iob/StateInterface';

const automationSpecBuilder = new AutomationSpecInterfaceBuilder();
const automationBuilder = new AutomationInterfaceBuilder();
const instructionBuilder = new InstructionInterfaceBuilder();

export const states: StateInterface[] = [
  new State({
    id: 'gjsm.0.automations.test_automation',
    ack: true,
    val: JSON.stringify(
      automationSpecBuilder
        .withFilterType(FilterType.function)
        .withGroupFilter('test_function')
        .withAutomations([
          automationBuilder
            .withSourceStateName('source_state')
            .withInstructions([
              instructionBuilder
                .defaultMapValueInstruction()
                .withJsonPathVal('$.numberValue')
                .withTargetStateName('target_state_number')
                .build(),
            ])
            .build(),
        ])
        .build(),
    ),
  }),
];
