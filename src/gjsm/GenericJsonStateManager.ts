import { ErrorParameterAdditionsInterface } from '../error/ErrorParameterAdditionsInterface';
import { EventEmitter } from '../events/EventEmitter';
import { ObjectClientInterface } from '../iob/ObjectClientInterface';
import { LoggerInterface } from '../logger/LoggerInterface';
import { GenericJsonStateManagerInterface } from './GenericJsonStateManagerInterface';
import { GenericJsonStateMapperEventMap } from './GenericJsonStateMapperEventMap';
import { ConfigProviderInterface } from './configuration/ConfigProviderInterface';
import { AutomationSpecProcessorInterface } from './specification/AutomationSpecProcessorInterface';
import { AutomationSpecProviderInterface } from './specification/AutomationSpecProviderInterface';

export class GenericJsonStateManager implements GenericJsonStateManagerInterface {
  public errorEmitter: EventEmitter<GenericJsonStateMapperEventMap> =
    new EventEmitter<GenericJsonStateMapperEventMap>();

  private _logger: LoggerInterface;
  private _configProvider: ConfigProviderInterface;
  private _specProvider: AutomationSpecProviderInterface;
  private _specProcessor: AutomationSpecProcessorInterface;
  private _onjectClient: ObjectClientInterface;

  public constructor(
    logger: LoggerInterface,
    configProvider: ConfigProviderInterface,
    specProvider: AutomationSpecProviderInterface,
    specProcessor: AutomationSpecProcessorInterface,
    objectClient: ObjectClientInterface,
  ) {
    this._logger = logger;
    this._configProvider = configProvider;
    this._specProvider = specProvider;
    this._specProcessor = specProcessor;
    this._onjectClient = objectClient;
  }

  public async processAutomationDefinitions(): Promise<void> {
    for (const spec of this._specProvider.specifications) {
      if (spec.automations) {
        for (const automation of spec.automations) {
          try {
            await this._specProcessor.getFilteredSourceStates(
              spec.filterType!,
              spec.groupFilter!,
              automation.sourceStateName,
            );
          } catch (error) {
            this._logger.warn(`Error while processing automation spec ${spec.id}: ${(error as Error).message}`);
          }
        }
      }
    }
  }

  public async loadConfig(): Promise<void> {
    try {
      await this._configProvider.loadConfig();
    } catch (error) {
      this.handleError(error as Error, {
        message: 'Error while loading configuration.',
        isCritical: true,
      });
    }

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
          this._logger.warn(`Automation definition ${spec.id} loaded with error: ${error}`);
        });
      }
    });
  }

  public async initialize(): Promise<void> {
    await this.loadConfig();
    // Subscribe to changes of the automation states
    await this._onjectClient.subscribeStatesAsync(this._configProvider.config.automationStatesPattern);
    // TODO: Subcscribe to changes of the config object
  }

  private handleError(error: Error, additionalData?: ErrorParameterAdditionsInterface): void {
    this.errorEmitter.emit('error', error, additionalData);
  }
}
