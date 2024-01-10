import { ObjectInterface } from './ObjectInterface';
import { StateInterface } from './StateInterface';

export interface StateManagerInterface {
  getStatesAsync(pattern: string): Promise<StateInterface[]>;
  getForeignObjectAsync(id: string): Promise<ObjectInterface | null>;
}
