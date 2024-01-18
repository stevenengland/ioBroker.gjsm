import { ObjectClientInterface } from '../../iob/ObjectClientInterface';
import { StateInterface } from '../../iob/StateInterface';
import { ConfigProviderInterface } from '../configuration/ConfigProviderInterface';
import { AutomationSpecProcessorInterface } from './AutomationSpecProcessorInterface';
import { FilterType } from './FilterType';

export class AutomationSpecProcessor implements AutomationSpecProcessorInterface {
  private readonly _objectClient: ObjectClientInterface;
  private readonly _configProvider: ConfigProviderInterface;

  public constructor(configProvider: ConfigProviderInterface, objectClient: ObjectClientInterface) {
    this._objectClient = objectClient;
    this._configProvider = configProvider;
  }

  public async getFilteredSourceStates(
    filterType: FilterType,
    groupFilter: string,
    sourceStateName: string,
  ): Promise<StateInterface[]> {
    let result = new Array<StateInterface>();
    // Stage 1: Check the filter type and apply group filter
    switch (filterType) {
      case FilterType.function:
        result = await this.getFilteredStatesByFunction(groupFilter);
        break;
      default:
        throw new Error(`Filter type ${filterType} is not supported.`);
    }

    return this.getFilteredStatesBySourceStateName(result, sourceStateName);
  }

  // public async applyMappingSubscriptions(sourceStateName: string, mappings: MappingInterface[]): Promise<void> {
  //   throw new Error('Method not implemented.');
  // }

  private async getFilteredStatesByFunction(groupFilter: string): Promise<StateInterface[]> {
    const result = new Array<StateInterface>();
    // Get the object with the id represented by the group filter
    const functionObj = await this._objectClient.getForeignObjectAsync(
      this._configProvider.config.functionsNamespace + '.' + groupFilter,
    );
    if (!functionObj) {
      return result;
    }

    // Get the members of the function object and iterate over every one of them to get the state objects affected by the function
    const functionMembers = (functionObj.common as ioBroker.EnumCommon).members || [];
    for (const member of functionMembers) {
      const affectedStates = await this._objectClient.getStatesAsync(member + '*');
      // Add affectedStates to the result set
      affectedStates.forEach((state) => result.push(state));
    }
    const newResult = Array.from<StateInterface>(
      result.reduce((map, obj: StateInterface) => map.set(obj.id, obj), new Map()).values(),
    );
    return newResult;
  }

  private getFilteredStatesBySourceStateName(states: StateInterface[], sourceStateName: string): StateInterface[] {
    return states.filter((state) => this._objectClient.getStateName(state.id) === sourceStateName);
  }
}
