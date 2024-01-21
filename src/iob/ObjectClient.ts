import * as utils from '@iobroker/adapter-core';
import { ObjectClientInterface } from './ObjectClientInterface';
import { ObjectInterface } from './ObjectInterface';
import { State } from './State';
import { StateInterface } from './StateInterface';

export class ObjectClient implements ObjectClientInterface {
  private readonly _adapter: utils.AdapterInstance;
  public constructor(adapter: utils.AdapterInstance) {
    this._adapter = adapter;
  }

  //#region state retrieval
  public async getStatesAsync(pattern: string): Promise<StateInterface[]> {
    const result = new Array<StateInterface>();
    const records = await this._adapter.getStatesAsync(pattern);
    Object.entries(records).map((key) => {
      result.push(this.mapIoBrokerState(key[0], key[1]));
    });
    return result;
  }

  public async getForeignStateAsync(id: string): Promise<StateInterface | null> {
    const state = await this._adapter.getForeignStateAsync(id);
    if (!state) {
      return null;
    }
    const result = new State(state, id);
    return result;
  }

  public async setForeignStateAsync(id: string, state: StateInterface): Promise<void> {
    await this._adapter.setForeignStateAsync(id, state);
  }

  public async existsStateAsync(id: string): Promise<boolean> {
    const state = await this.getForeignStateAsync(id);
    return state !== null;
  }

  public async subscribeStatesAsync(pattern: string): Promise<void> {
    await this._adapter.subscribeStatesAsync(pattern);
  }

  public async subscribeForeignStatesAsync(pattern: string): Promise<void> {
    await this._adapter.subscribeForeignStatesAsync(pattern);
  }
  //#endregion

  //#region object retrieval
  public async getForeignObjectAsync(id: string): Promise<ObjectInterface | null> {
    const obj = await this._adapter.getForeignObjectAsync(id, {});
    if (!obj) {
      // throw new IobError(`Object with ${id} not found`);
      return null;
    }
    const result = { id: obj._id, native: obj.native } as ObjectInterface;
    return result;
  }
  //#endregion

  //#region state helper
  public getStateName(stateId: string): string {
    const parts = stateId.split(/(.*)\./);
    return parts.length === 3 ? parts[2] : '';
  }

  public getStateParentId(stateId: string): string {
    const parts = stateId.split(/(.*)\./);
    return parts.length === 3 ? parts[1] : '';
  }

  public async getStateSiblingsIds(stateId: string): Promise<string[]> {
    const stateParent = this.getStateParentId(stateId);
    const stateSiblings = await this.getStatesAsync(stateParent + '*]');
    const siblingIds = stateSiblings.map((sibling) => sibling.id);
    return siblingIds;
  }

  private mapIoBrokerState(id: string, state: ioBroker.State): StateInterface {
    const result = {
      id: id,
      val: state.val,
      ts: state.ts,
      ack: state.ack,
    } as StateInterface;
    return result;
  }
  //#endregion
}
