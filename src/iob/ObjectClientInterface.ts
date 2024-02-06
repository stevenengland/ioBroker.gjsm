import { ObjectType } from './types/ObjectType';
import { StateInterface } from './types/StateInterface';

export interface ObjectClientInterface {
  getStatesAsync(pattern: string): Promise<StateInterface[]>;
  getForeignStatesAsync(pattern: string): Promise<StateInterface[]>;
  getForeignStateAsync(id: string): Promise<StateInterface | null>;
  setStateAsync(state: StateInterface): Promise<void>;
  setForeignStateAsync(state: StateInterface): Promise<void>;
  existsStateAsync(id: string): Promise<boolean>;
  subscribeStatesAsync(pattern: string): Promise<void>;
  subscribeForeignStatesAsync(pattern: string): Promise<void>;
  getForeignObjectAsync(id: string): Promise<ObjectType | null>;
  subscribeForeignObjectsAsync(pattern: string): Promise<void>;
  setForeignObjectNotExistsAsync(id: string, obj: ObjectType): Promise<void>;
  getStateName(stateId: string): string;
  getStateParentId(stateId: string): string;
  getStateSiblingsIds(stateId: string): Promise<string[]>;
  isObjectOfTypeState(objectId: string): Promise<boolean>;
}
