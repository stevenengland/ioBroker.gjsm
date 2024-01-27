import { ObjectClientInterface } from '../../iob/ObjectClientInterface';
import { State } from '../../iob/State';
import { StateInterface } from '../../iob/StateInterface';
import { StateValueType } from '../../iob/StateValueType';
import { JsonPathInterface } from '../../json_path/JsonPathInterface';
import { ConfigProviderInterface } from '../configuration/ConfigProviderInterface';
import { AutomationError } from './AutomationError';
import { AutomationSpecProcessorInterface } from './AutomationSpecProcessorInterface';
import { FilterType } from './FilterType';
import { ExecutionResult } from './instructions/ExecutionResult';
import { Instruction } from './instructions/Instruction';
import { MapValueInstruction } from './instructions/MapValueInstruction';

export class AutomationSpecProcessor implements AutomationSpecProcessorInterface {
  private readonly _objectClient: ObjectClientInterface;
  private readonly _configProvider: ConfigProviderInterface;
  private readonly _jsonPath: JsonPathInterface;

  public constructor(
    configProvider: ConfigProviderInterface,
    objectClient: ObjectClientInterface,
    jsonPath: JsonPathInterface,
  ) {
    this._objectClient = objectClient;
    this._configProvider = configProvider;
    this._jsonPath = jsonPath;
  }

  public async executeInstruction(sourceState: State, instruction: Instruction): Promise<ExecutionResult> {
    if (instruction instanceof MapValueInstruction) {
      return this.mapValue(sourceState, instruction);
    } else {
      return ExecutionResult.instructionNotImplemented;
    }
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

  private async getFilteredStatesByFunction(groupFilter: string): Promise<StateInterface[]> {
    const result = new Array<StateInterface>();
    // Get the object with the id represented by the group filter
    const functionObj = await this._objectClient.getForeignObjectAsync(
      this._configProvider.config.functionsNamespace + '.' + groupFilter,
    );
    if (!functionObj?.common || !(functionObj.common as ioBroker.EnumCommon).members) {
      throw new AutomationError(
        `Function object ${this._configProvider.config.functionsNamespace + '.' + groupFilter} doesn't exist or has no members.`,
      );
    }

    // Get the members of the function object and iterate over every one of them to get the state objects affected by the function
    const functionMembers = (functionObj.common as ioBroker.EnumCommon).members;
    for (const member of functionMembers ?? []) {
      const affectedStates = await this._objectClient.getForeignStatesAsync(member + '.*');
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

  private async mapValue(sourceState: State, instruction: MapValueInstruction): Promise<ExecutionResult> {
    const targetState = await this._objectClient.getForeignStateAsync(
      this._objectClient.getStateParentId(sourceState.id) + '.' + instruction.targetStateName,
    );
    if (!targetState) {
      // TODO: If create state is allowed, create the state. Before creating the state, check if the object exists.
      return ExecutionResult.targetStateNotFound;
    }

    // Get and test target value
    const targetValues = this._jsonPath.getValues(instruction.jsonPathVal, sourceState.val as string);
    if (targetValues.length === 0) {
      return ExecutionResult.jsonPathNoMatch;
    }

    // TODO: Target value validation.
    targetState.val = targetValues[0] as StateValueType;

    targetState.ack = true;

    await this._objectClient.setForeignStateAsync(targetState.id, targetState);

    return ExecutionResult.success;
  }
}
