import { ObjectClientInterface } from '../iob/ObjectClientInterface';
import { LoggerInterface } from '../logger/LoggerInterface';
import { GenericJsonStateManagerInterface } from './GenericJsonStateManagerInterface';
import { ConfigProviderInterface } from './configuration/ConfigProviderInterface';
import { AutomationSpecProviderInterface } from './specification/AutomationSpecProviderInterface';

export class GenericJsonStateManager implements GenericJsonStateManagerInterface {
  private _logger: LoggerInterface;
  private _configProvider: ConfigProviderInterface;
  private _specProvider: AutomationSpecProviderInterface;
  private _onjectClient: ObjectClientInterface;

  public constructor(
    logger: LoggerInterface,
    configProvider: ConfigProviderInterface,
    specProvider: AutomationSpecProviderInterface,
    objectClient: ObjectClientInterface,
  ) {
    this._logger = logger;
    this._configProvider = configProvider;
    this._specProvider = specProvider;
    this._onjectClient = objectClient;
  }
  public async loadConfig(): Promise<void> {
    await this._configProvider.loadConfig();
    this._logger.debug('Config successfully loaded.');
  }
  public async loadAutomationDefinitions(): Promise<void> {
    try {
      await this._specProvider.loadSpecifications();
    } catch (error) {
      this._logger.error(`Error while loading automation definitions: ${(error as Error).message}`);
    }

    if (this._specProvider.specifications.length === 0) {
      this._logger.warn('No automation definitions found.');
    } else {
      this._logger.info(`${this._specProvider.specifications.length} Automation definition(s) loaded.`);
    }

    this._specProvider.specifications.forEach((spec) => {
      if (spec.errors) {
        spec.errors.forEach((error) => {
          this._logger.warn(`Automation definition loaded with error: ${error}`);
        });
      }
    });
  }

  public async initialize(): Promise<void> {
    await this.loadConfig();
    // TODO: abbonieren von automation definition states
    await this._onjectClient.subscribeStatesAsync(this._configProvider.config.automationStatesPattern);
    // TODO: Int
  }
}
