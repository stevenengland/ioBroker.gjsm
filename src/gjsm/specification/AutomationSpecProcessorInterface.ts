import { State } from '../../iob/State';
import { StateInterface } from '../../iob/StateInterface';
import { FilterType } from './FilterType';
import { ExecutionResult } from './instructions/ExecutionResult';
import { InstructionInterface } from './instructions/InstructionInterface';

export interface AutomationSpecProcessorInterface {
  // for states and devices? Channels?
  getFilteredSourceStates(
    filterType: FilterType,
    groupFilter: string,
    sourceStateName: string,
  ): Promise<StateInterface[]>;
  executeInstruction(sourceState: State, instruction: InstructionInterface): Promise<ExecutionResult>;
}
