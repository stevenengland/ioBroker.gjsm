import { ObjectInterface } from './ObjectInterface';
import { StateInterface } from './StateInterface';

export interface ObjectClientInterface {
  getStatesAsync(pattern: string): Promise<StateInterface[]>;
  getForeignStatesAsync(pattern: string): Promise<StateInterface[]>;
  getForeignStateAsync(id: string): Promise<StateInterface | null>;
  setStateAsync(state: StateInterface): Promise<void>;
  setForeignStateAsync(state: StateInterface): Promise<void>;
  existsStateAsync(id: string): Promise<boolean>;
  subscribeStatesAsync(pattern: string): Promise<void>;
  subscribeForeignStatesAsync(pattern: string): Promise<void>;
  getForeignObjectAsync(id: string): Promise<ObjectInterface | null>;
  subscribeForeignObjectsAsync(pattern: string): Promise<void>;
  getStateName(stateId: string): string;
  getStateParentId(stateId: string): string;
  getStateSiblingsIds(stateId: string): Promise<string[]>;
  isObjectOfTypeState(objectId: string): Promise<boolean>;
}
