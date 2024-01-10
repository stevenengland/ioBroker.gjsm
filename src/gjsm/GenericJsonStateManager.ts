import { LoggerInterface } from '../logger_lib/LoggerInterface';
import { GenericJsonStateManagerInterface } from './GenericJsonStateManagerInterface';
import { ConfigProviderInterface } from './configuration/ConfigProviderInterface';
import { SpecificationProviderInterface } from './specification/SpecificationProviderInterface';

export class GenericJsonStateManager implements GenericJsonStateManagerInterface {
  private _logger: LoggerInterface;
  private _configProvider: ConfigProviderInterface;
  private _specProvider: SpecificationProviderInterface;

  public constructor(
    logger: LoggerInterface,
    configProvider: ConfigProviderInterface,
    specProvider: SpecificationProviderInterface,
  ) {
    this._logger = logger;
    this._configProvider = configProvider;
    this._specProvider = specProvider;

    this._logger.debug('GSJ Manager initialized.');
  }

  public async initialize(): Promise<void> {
    await this._configProvider.loadConfig();
    await this._specProvider.loadSpecifications();
  }
}
