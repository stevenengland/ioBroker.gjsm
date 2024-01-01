import { IobAdapterLogger } from '../logger_lib/IobAdapterLogger';
import { GenericJsonStateManagerInterface } from './GenericJsonStateManagerInterface';

export class GenericJsonStateManager implements GenericJsonStateManagerInterface {
  private _logger: IobAdapterLogger;

  public constructor(logger: IobAdapterLogger) {
    this._logger = logger;

    this._logger.debug('Manager initialized.');
  }
}
