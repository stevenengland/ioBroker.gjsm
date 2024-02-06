import { AutomationInterfaceBuilder } from '../../../src/gjsm/specification/AutomationInterface.Factory.test';
import { AutomationSpecInterfaceBuilder } from '../../../src/gjsm/specification/AutomationSpecInterface.Factory.test';
import { FilterType } from '../../../src/gjsm/specification/FilterType';
import { InstructionInterfaceBuilder } from '../../../src/gjsm/specification/instructions/InstructionInterface.Factory.test';
import { MapValueInstructionBuilder } from '../../../src/gjsm/specification/instructions/MapValueInstruction.Factory.test';
import { State } from '../../../src/iob/types/State';
import { StateInterface } from '../../../src/iob/types/StateInterface';

const automationSpecBuilder = new AutomationSpecInterfaceBuilder();
const automationBuilder = new AutomationInterfaceBuilder();
const instructionBuilder = new InstructionInterfaceBuilder();

export const states: StateInterface[] = [
  new State('gjsm.0.automations.test_automation', {
    ack: true,
    val: JSON.stringify(
      automationSpecBuilder
        .withFilterType(FilterType.function)
        .withGroupFilter('test_function')
        .withAutomations([
          automationBuilder
            .withSourceStateName('source_state')
            .withInstructions([
              // Map value instructions for number, boolean and string that already exist as target states
              instructionBuilder
                .defaultMapValueInstruction()
                .withMapValue(
                  new MapValueInstructionBuilder()
                    .withJsonPathVal('$.numberValue')
                    .withTargetStateName('target_state_number')
                    .build(),
                )
                .build(),
              instructionBuilder
                .defaultMapValueInstruction()
                .withMapValue(
                  new MapValueInstructionBuilder()
                    .withJsonPathVal('$.booleanValue')
                    .withTargetStateName('target_state_boolean')
                    .build(),
                )
                .build(),
              instructionBuilder
                .defaultMapValueInstruction()
                .withMapValue(
                  new MapValueInstructionBuilder()
                    .withJsonPathVal('$.stringValue')
                    .withTargetStateName('target_state_string')
                    .build(),
                )
                .build(),
              // Map value instructions for a state that does not exist as target state
              instructionBuilder
                .defaultMapValueInstruction()
                .withMapValue(
                  new MapValueInstructionBuilder()
                    .withJsonPathVal('$.numberValue')
                    .withTargetStateName('target_state_number__that_does_not_exist_and_needs_to_be_created')
                    .build(),
                )
                .build(),
            ])
            .build(),
        ])
        .build(),
    ),
  }),
];
