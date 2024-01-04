export type StateValueType = boolean | number | string | null;

export class State {
  public id!: string;
  public val: StateValueType = null;
  public ts?: number;
  public ack: boolean = false;
  public readonly exists: boolean = false;

  public constructor(init?: Partial<State>) {
    Object.assign(this, init);
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
