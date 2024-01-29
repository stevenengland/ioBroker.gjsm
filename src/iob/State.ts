import { StateInterface } from './StateInterface';
import { StateValueType } from './StateValueType';

export class State implements StateInterface {
  public id = '';
  public val: StateValueType = null;
  public ts: number = Math.floor(Date.now() / 1000);
  public ack = false;

  public constructor(id: string, state?: StateInterface | Partial<StateInterface>) {
    this.id = id;
    Object.assign(this, state);
  }

  public setTimeStamp(time: unknown): void {
    if (typeof time === 'string') {
      const date = Date.parse(time);
      this.ts = Math.floor(date / 1000);
    } else if (typeof time === 'number') {
      this.ts = time;
    } else {
      this.ts = NaN;
    }
  }
}
