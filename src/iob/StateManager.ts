import * as utils from '@iobroker/adapter-core';
import { ObjectInterface } from './ObjectInterface';
import { StateInterface } from './StateInterface';
import { StateManagerInterface } from './StateManagerInterface';

export class StateManager implements StateManagerInterface {
  private _adapter: utils.AdapterInstance;
  public constructor(adapter: utils.AdapterInstance) {
    this._adapter = adapter;
  }

  public async getStatesAsync(pattern: string): Promise<StateInterface[]> {
    const result = new Array<StateInterface>();
    // ToDo: Error Handling
    const records = await this._adapter.getStatesAsync(pattern);
    Object.entries(records).map((key) => {
      const state = key[1] as StateInterface;
      state.id = key[0];
      result.push(state);
    });
    return result;
  }

  public async getForeignObjectAsync(id: string): Promise<ObjectInterface | null> {
    // ToDo: Error Handling
    const obj = await this._adapter.getForeignObjectAsync(id, {});
    if (!obj) {
      // throw new IobError(`Object with ${id} not found`);
      return null;
    }
    const result = { id: obj._id, native: obj.native } as ObjectInterface;
    return result;
  }
}
