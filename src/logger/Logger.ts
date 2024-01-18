import * as utils from '@iobroker/adapter-core';
import { LoggerInterface } from './LoggerInterface';

export class Logger implements LoggerInterface {
  private readonly _adapter: utils.AdapterInstance;

  public constructor(adapter: utils.AdapterInstance) {
    this._adapter = adapter;
  }

  public debug(message: string): void {
    this._adapter.log.debug(message);
  }
  public info(message: string): void {
    this._adapter.log.info(message);
  }
  public warn(message: string): void {
    this._adapter.log.warn(message);
  }
  public error(message: string): void {
    this._adapter.log.error(message);
  }
}
