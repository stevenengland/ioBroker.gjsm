import { ObjectInterface } from './ObjectInterface';
import { StateInterface } from './StateInterface';

export interface ObjectClientInterface {
  getStatesAsync(pattern: string): Promise<StateInterface[]>;
  getForeignObjectAsync(id: string): Promise<ObjectInterface | null>;
  subscribeStatesAsync(pattern: string): Promise<void>;
}
