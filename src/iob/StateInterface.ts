import { StateValueType } from './State';

export interface StateInterface {
  id: string;

  /** The value of the state. */
  val: StateValueType;

  /** Direction flag: false for desired value and true for actual value. Default: false. */
  ack: boolean;

  /** Unix timestamp. Default: current time */
  ts: number;

  /** Unix timestamp of the last time the value changed */
  //lc: number;

  /** Name of the adapter instance which set the value, e.g. "system.adapter.web.0" */
  //from: string;

  /** The user who set this value */
  //user?: string;

  /** Optional time in seconds after which the state is reset to null */
  //expire?: number;

  /** Optional quality of the state value */
  //q?: STATE_QUALITY;

  /** Optional comment */
  //c?: string;
}
