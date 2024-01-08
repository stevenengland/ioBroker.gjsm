import * as utils from '@iobroker/adapter-core';
import { StateInterface } from './StateInterface';
import { StateManagerInterface } from './StateManagerInterface';

export class StateManager implements StateManagerInterface {
  private _adapter: utils.AdapterInstance;
  public constructor(adapter: utils.AdapterInstance) {
    this._adapter = adapter;
  }
  public async getStatesAsync(pattern: string): Promise<StateInterface[]> {
    // ToDo: Error Handling
    const result = new Array<StateInterface>();
    const records = await this._adapter.getStatesAsync(pattern);
    Object.entries(records).map((key) => {
      const state = key[1] as StateInterface;
      state.id = key[0];
      result.push(state);
    });
    return result;
  }
}
