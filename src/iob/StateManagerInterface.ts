import { StateInterface } from './StateInterface';

export interface StateManagerInterface {
  getStatesAsync(pattern: string): Promise<StateInterface[]>;
}
