import { StateInterface } from './StateInterface';

export type StateValueType = boolean | number | string | null;

export class State implements StateInterface {
  public id = '';
  public val: StateValueType = null;
  public ts: number = Math.floor(Date.now() / 1000);
  public ack = false;

  public constructor(state?: StateInterface | Partial<StateInterface>) {
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
