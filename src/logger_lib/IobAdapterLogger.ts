import * as utils from '@iobroker/adapter-core';
import { LoggerInterface } from './LoggerInterface';

export class IobAdapterLogger implements LoggerInterface {
    private _adapter: utils.AdapterInstance;
    public debug(message: string): void {
        this._adapter.log.debug('# JSM: ' + message);
    }
    public info(message: string): void {
        this._adapter.log.info('# JSM: ' + message);
    }
    public warn(message: string): void {
        this._adapter.log.warn('# JSM: ' + message);
    }
    public error(message: string): void {
        this._adapter.log.error('# JSM: ' + message);
    }

    public constructor(adapter: utils.AdapterInstance) {
        this._adapter = adapter;
    }
}
