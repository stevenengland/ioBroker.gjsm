import { unpackError } from '../error/ErrorHandling';
import { ErrorParameterAdditionsInterface } from '../error/ErrorParameterAdditionsInterface';
import { EventEmitter } from '../events/EventEmitter';
import { ObjectClientInterface } from '../iob/ObjectClientInterface';
import { State } from '../iob/State';
import { LoggerInterface } from '../logger/LoggerInterface';
import { GenericJsonStateManagerInterface } from './GenericJsonStateManagerInterface';
import { GenericJsonStateMapperEventMap } from './GenericJsonStateMapperEventMap';
import { AutomationRepositoryInterface } from './automation_repository/AutomationRepositoryInterface';
import { ConfigProviderInterface } from './configuration/ConfigProviderInterface';
import { AutomationSpecProcessorInterface } from './specification/AutomationSpecProcessorInterface';
import { AutomationSpecProviderInterface } from './specification/AutomationSpecProviderInterface';
import { ExecutionResult } from './specification/instructions/ExecutionResult';

export class GenericJsonStateManager implements GenericJsonStateManagerInterface {
  public errorEmitter: EventEmitter<GenericJsonStateMapperEventMap> =
    new EventEmitter<GenericJsonStateMapperEventMap>();

  private readonly _logger: LoggerInterface;
  private readonly _configProvider: ConfigProviderInterface;
  private readonly _specProvider: AutomationSpecProviderInterface;
  private readonly _specProcessor: AutomationSpecProcessorInterface;
  private readonly _objectClient: ObjectClientInterface;
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
    this._objectClient = objectClient;
    this._autoRepository = autoRepository;
  }

  public async createSubscriptionsAndRepositoryForSourceStates(): Promise<void> {
    this._autoRepository.deleteAllAutomations();
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
              `Subscribing to ${statesToSubscribe.length} states for automation definition ${spec.id} with a filter of "${spec.filterType}=${spec.groupFilter}".`,
            );
            // TODO: Set status state of adapter and create integration test?
            for (const state of statesToSubscribe) {
              await this._objectClient.subscribeForeignStatesAsync(state.id);
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

  public async handleStateChange(id: string, state: State): Promise<void> {
    if (
      id.startsWith(
        this._configProvider.config.instanceName +
          '.' +
          this._configProvider.config.instanceId +
          '.' +
          this._configProvider.config.automationNamespace,
      )
    ) {
      this._logger.debug(`Changed configuration ${id} detected, reloading automation specification.`);
      await this.loadAutomationDefinitions();
      await this.createSubscriptionsAndRepositoryForSourceStates();
      return;
    }
    const automations = this._autoRepository.getAutomations(id);
    for (const automation of automations) {
      // Try catch for single operation so that a failing execution does not prevent other automations from being executed
      try {
        this._logger.debug(`Executing automation ${automation.name ?? 'unnamed'} for state ${id}`);
        const execResult = await this._specProcessor.executeInstruction(state, automation);
        switch (execResult) {
          case ExecutionResult.success:
            this._logger.debug(`Instruction ${automation.name ?? 'unnamed'} for state ${id} executed.`);
            break;
          case ExecutionResult.instructionNotImplemented:
            this._logger.warn(`Instruction ${automation.name ?? 'unnamed'} for state ${id} is not implemented.`);
            break;
          case ExecutionResult.jsonPathNoMatch:
            this._logger.warn(`Instruction ${automation.name ?? 'unnamed'} for state ${id} found no JSON path match.`);
            break;
          case ExecutionResult.targetStateNotFound:
            this._logger.warn(`Instruction ${automation.name ?? 'unnamed'} for state ${id} found no target state.`);
            break;
          default:
            this._logger.warn(
              `Instruction ${automation.name ?? 'unnamed'} for state ${id} returned an unexpected result.`,
            );
        }
      } catch (error) {
        this.logWarning(`Error while executing automation ${automation.name ?? 'unnamed'} for state ${id}`, error);
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
    this._logger.debug(JSON.stringify(this._configProvider.config, null, 2));
  }

  public async loadAutomationDefinitions(): Promise<void> {
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
    await this._objectClient.subscribeStatesAsync(this._configProvider.config.automationStatesPattern);
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
