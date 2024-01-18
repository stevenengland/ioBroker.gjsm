import { StateInterface } from '../../iob/StateInterface';
import { FilterType } from './FilterType';

export interface SpecificationProcessorInterface {
  // for states and devices? Channels?
  getFilteredSourceStates(
    filterType: FilterType,
    groupFilter: string,
    sourceStateName: string,
  ): Promise<StateInterface[]>;
  // applyMappingSubscriptions(sourceStateName: string, mappings: MappingInterface[]): Promise<void>;
}
