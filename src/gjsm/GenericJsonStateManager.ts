import { unpackError } from '../error/ErrorHandling';
import { ErrorParameterAdditionsInterface } from '../error/ErrorParameterAdditionsInterface';
import { EventEmitter } from '../events/EventEmitter';
import { ObjectClientInterface } from '../iob/ObjectClientInterface';
import { LoggerInterface } from '../logger/LoggerInterface';
import { GenericJsonStateManagerInterface } from './GenericJsonStateManagerInterface';
import { GenericJsonStateMapperEventMap } from './GenericJsonStateMapperEventMap';
import { AutomationRepositoryInterface } from './automation_repository/AutomationRepositoryInterface';
import { ConfigProviderInterface } from './configuration/ConfigProviderInterface';
import { AutomationSpecProcessorInterface } from './specification/AutomationSpecProcessorInterface';
import { AutomationSpecProviderInterface } from './specification/AutomationSpecProviderInterface';

export class GenericJsonStateManager implements GenericJsonStateManagerInterface {
  public errorEmitter: EventEmitter<GenericJsonStateMapperEventMap> =
    new EventEmitter<GenericJsonStateMapperEventMap>();

  private readonly _logger: LoggerInterface;
  private readonly _configProvider: ConfigProviderInterface;
  private readonly _specProvider: AutomationSpecProviderInterface;
  private readonly _specProcessor: AutomationSpecProcessorInterface;
  private readonly _onjectClient: ObjectClientInterface;
  private readonly _autoRepository: AutomationRepositoryInterface;

  public constructor(
    logger: LoggerInterface,
    configProvider: ConfigProviderInterface,
    specProvider: AutomationSpecProviderInterface,
    specProcessor: AutomationSpecProcessorInterface,
    objectClient: ObjectClientInterface,
    autoRepository: AutomationRepositoryInterface,
  ) {
    this._logger = logger;
    this._configProvider = configProvider;
    this._specProvider = specProvider;
    this._specProcessor = specProcessor;
    this._onjectClient = objectClient;
    this._autoRepository = autoRepository;
  }

  public async createSubscriptionsAndRepositoryForSourceStates(): Promise<void> {
    for (const spec of this._specProvider.specifications) {
      if (spec.automations) {
        for (const automation of spec.automations) {
          try {
            const statesToSubscribe = await this._specProcessor.getFilteredSourceStates(
              spec.filterType!,
              spec.groupFilter!,
              automation.sourceStateName,
            );
            this._logger.debug(
              `Subscribing to ${statesToSubscribe.length} states for automation definition ${spec.id}.`,
            );
            for (const state of statesToSubscribe) {
              await this._onjectClient.subscribeForeignStatesAsync(state.id);
              this._logger.debug(`Subscribed to ${state.id}.`);
              for (const instruction of automation.instructions) {
                this._autoRepository.addAutomations(state.id, [instruction]);
              }
            }
          } catch (error) {
            this.logWarning(`Error while processing automation spec ${spec.id}`, error);
          }
        }
      }
    }
  }

  public async loadConfig(): Promise<void> {
    try {
      await this._configProvider.loadConfig();
    } catch (error) {
      this.notifyOfAnError(error as Error, {
        message: 'Error while loading configuration.',
        isCritical: true,
      });
    }

    this._logger.debug('Config successfully loaded.');
  }

  public async loadAutomationDefinitions(): Promise<void> {
    this._autoRepository.deleteAllAutomations();

    try {
      await this._specProvider.loadSpecifications();
    } catch (error) {
      this.logError(`Error while loading automation definitions`, error);
    }

    if (this._specProvider.specifications.length === 0) {
      this.logWarning('No automation definitions found.');
    } else {
      this._logger.info(`${this._specProvider.specifications.length} Automation definition(s) loaded.`);
    }

    this._specProvider.specifications.forEach((spec) => {
      if (spec.errors) {
        spec.errors.forEach((error) => {
          this.logWarning(`Automation definition ${spec.id} loaded with error: ${error}`);
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

  private logError(message: string, error?: unknown): void {
    let enrichedMessage = message;
    if (error && error instanceof Error) {
      enrichedMessage += `\nThe error was:  ${error.message}`;
    }
    this._logger.error(enrichedMessage);
    this.debugLogUnpackedError(error);
  }

  private logWarning(message: string, error?: unknown): void {
    let enrichedMessage = message;
    if (error && error instanceof Error) {
      enrichedMessage += `\nThe error was:  ${error.message}`;
    }
    this._logger.warn(enrichedMessage);
    this.debugLogUnpackedError(error);
  }

  private debugLogUnpackedError(error?: unknown): void {
    if (error) {
      this._logger.debug(JSON.stringify(unpackError(error)));
    }
  }

  private notifyOfAnError(error: Error, additionalData?: ErrorParameterAdditionsInterface): void {
    this.errorEmitter.emit('error', error, additionalData);
  }
}
