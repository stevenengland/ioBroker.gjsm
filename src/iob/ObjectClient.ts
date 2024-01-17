import * as utils from '@iobroker/adapter-core';
import { ObjectClientInterface } from './ObjectClientInterface';
import { ObjectInterface } from './ObjectInterface';
import { StateInterface } from './StateInterface';

export class ObjectClient implements ObjectClientInterface {
  private _adapter: utils.AdapterInstance;
  public constructor(adapter: utils.AdapterInstance) {
    this._adapter = adapter;
  }

  //#region state retrieval
  public async getStatesAsync(pattern: string): Promise<StateInterface[]> {
    const result = new Array<StateInterface>();
    // ToDo: Error Handling
    const records = await this._adapter.getStatesAsync(pattern);
    Object.entries(records).map((key) => {
      result.push(this.mapIoBrokerState(key[0], key[1]));
    });
    return result;
  }

  //#endregion

  //#region object retrieval
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

  public async subscribeStatesAsync(pattern: string): Promise<void> {
    await this._adapter.subscribeStatesAsync(pattern);
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
