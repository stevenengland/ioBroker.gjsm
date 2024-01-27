import { ObjectInterface } from './ObjectInterface';
import { StateInterface } from './StateInterface';

export interface ObjectClientInterface {
  getStatesAsync(pattern: string): Promise<StateInterface[]>;
  getForeignStatesAsync(pattern: string): Promise<StateInterface[]>;
  getForeignStateAsync(id: string): Promise<StateInterface | null>;
  setForeignStateAsync(id: string, state: StateInterface): Promise<void>;
  existsStateAsync(id: string): Promise<boolean>;
  subscribeStatesAsync(pattern: string): Promise<void>;
  subscribeForeignStatesAsync(pattern: string): Promise<void>;
  getForeignObjectAsync(id: string): Promise<ObjectInterface | null>;
  getStateName(stateId: string): string;
  getStateParentId(stateId: string): string;
  getStateSiblingsIds(stateId: string): Promise<string[]>;
}
