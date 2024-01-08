import { LoggerInterface } from '../logger_lib/LoggerInterface';
import { GenericJsonStateManagerInterface } from './GenericJsonStateManagerInterface';

export class GenericJsonStateManager implements GenericJsonStateManagerInterface {
  private _logger: LoggerInterface;

  public constructor(logger: LoggerInterface) {
    this._logger = logger;

    this._logger.debug('Manager initialized.');
  }
}
