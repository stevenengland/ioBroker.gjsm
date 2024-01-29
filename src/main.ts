/*
 * Created with @iobroker/create-adapter v2.5.0
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
import * as utils from '@iobroker/adapter-core';

// Load your modules here, e.g.:
// import * as fs from "fs";
import { Json } from './data_format/Json';
import { Yaml } from './data_format/Yaml';
import { GenericJsonStateManager } from './gjsm/GenericJsonStateManager';
import { ConfigProvider } from './gjsm/configuration/ConfigProvider';
import { AutomationSpecProvider } from './gjsm/specification/AutomationSpecProvider';
import { ObjectClient } from './iob/ObjectClient';
import { Logger } from './logger/Logger';

import { AwilixContainer, InjectionMode, asClass, asValue, createContainer } from 'awilix';
import { DataFormatInterface } from './data_format/DataFormatInterface';
import { BaseError } from './error/BaseError';
import { unpackError } from './error/ErrorHandling';
import { ErrorParameterAdditionsInterface } from './error/ErrorParameterAdditionsInterface';
import { GenericJsonStateManagerInterface } from './gjsm/GenericJsonStateManagerInterface';
import { AutomationRepository } from './gjsm/automation_repository/AutomationRepository';
import { AutomationRepositoryInterface } from './gjsm/automation_repository/AutomationRepositoryInterface';
import { ConfigProviderInterface } from './gjsm/configuration/ConfigProviderInterface';
import { InstanceConfigInterface } from './gjsm/configuration/InstanceConfigInterface';
import { PublicConfigInterface } from './gjsm/configuration/PublicConfigInterface';
import { AutomationSpecProcessor } from './gjsm/specification/AutomationSpecProcessor';
import { AutomationSpecProcessorInterface } from './gjsm/specification/AutomationSpecProcessorInterface';
import { AutomationSpecProviderInterface } from './gjsm/specification/AutomationSpecProviderInterface';
import { ObjectClientInterface } from './iob/ObjectClientInterface';
import { State } from './iob/State';
import { JsonPath } from './json_path/JsonPath';
import { JsonPathInterface } from './json_path/JsonPathInterface';
import { LoggerInterface } from './logger/LoggerInterface';

interface IocContainerInterface {
  adapter: utils.AdapterInstance;
  publicConfig: PublicConfigInterface;
  instanceConfig: InstanceConfigInterface;
  objectClient: ObjectClientInterface;
  logger: LoggerInterface;
  yaml: DataFormatInterface;
  json: DataFormatInterface;
  jsonPath: JsonPathInterface;
  configProvider: ConfigProviderInterface;
  specProvider: AutomationSpecProviderInterface;
  specProcessor: AutomationSpecProcessorInterface;
  autoRepository: AutomationRepositoryInterface;
  gjsm: GenericJsonStateManagerInterface;
}

let iocContainer: AwilixContainer<IocContainerInterface>;

class Gjsm extends utils.Adapter {
  private _gjsm: GenericJsonStateManagerInterface | undefined;
  public constructor(options: Partial<utils.AdapterOptions> = {}) {
    super({
      ...options,
      name: 'gjsm',
    });
    this.on('ready', this.onReady.bind(this));
    this.on('stateChange', this.onStateChange.bind(this));
    this.on('objectChange', this.onObjectChange.bind(this));
    this.on('message', this.onMessage.bind(this));
    this.on('unload', this.onUnload.bind(this));
  }

  /**
   * Is called when databases are connected and adapter received configuration.
   */
  private async onReady(): Promise<void> {
    // Try to initialize the adapter, terminate if it fails.
    try {
      // 1. Prepare the IoC container as very base of the application
      this.prepareIocContainer();
      // 2. Resolve the main component and initialize it
      this._gjsm = iocContainer.cradle.gjsm;
      this._gjsm.errorEmitter.on('error', (error, additionalData) => {
        this.handleNotifiedError(error, { isCritical: additionalData?.isCritical });
      });
      await this._gjsm.initialize();
    } catch (error) {
      if (error instanceof Error) {
        this.handleNotifiedError(error, {
          message: `The adapter could not be initialized: ${error.message}`,
          isCritical: true,
        });
      } else {
        this.handleNotifiedError(new Error('The adapter could not be initialized because of an unexpected error.'), {
          isCritical: true,
        });
      }
    }

    // Process the automation definitions
    try {
      await this._gjsm?.loadAutomationDefinitions();
    } catch (error) {
      this.handleNotifiedError(
        new BaseError('The adapter could not load the automation definitions because of an unexpected error.', {
          cause: error,
        }),
        {
          isCritical: false,
        },
      );
    }
    try {
      await this._gjsm?.createSubscriptionsAndRepositoryForSourceStates();
    } catch (error) {
      this.handleNotifiedError(
        new BaseError('The adapter could not create state subscriptions and corresponding automation plans.', {
          cause: error,
        }),
        {
          isCritical: false,
        },
      );
    }
  }

  /**
   * Is called when adapter shuts down - callback has to be called under any circumstances!
   */
  private onUnload(callback: () => void): void {
    try {
      // Here you must clear all timeouts or intervals that may still be active
      // clearTimeout(timeout1);
      // clearTimeout(timeout2);
      // ...
      // clearInterval(interval1);

      callback();
    } catch (e) {
      callback();
    }
  }

  /**
   * Is called if a subscribed object changes
   */
  private onObjectChange(id: string, obj: ioBroker.Object | null | undefined): void {
    if (obj) {
      // The object was changed
      this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
    } else {
      // The object was deleted
      this.log.info(`object ${id} deleted`);
    }
  }

  /**
   * Is called if a subscribed state changes
   */
  private async onStateChange(id: string, state: ioBroker.State | null | undefined): Promise<void> {
    try {
      if (state) {
        // The state was changed
        await this._gjsm?.handleStateChange(id, new State(id, state));
      } else {
        // The state was deleted
        this.log.debug(`Subscribed state ${id} was deleted`);
      }
    } catch (error) {
      this.handleNotifiedError(
        new BaseError(`The adapter could not handle the changed state for state ${id}.`, {
          cause: error,
        }),
        {
          isCritical: false,
        },
      );
    }
  }

  /**
   * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
   * Using this method requires "common.messagebox" property to be set to true in io-package.json
   */
  private onMessage(obj: ioBroker.Message): void {
    if (typeof obj === 'object' && obj.message) {
      if (obj.command === 'send') {
        // e.g. send email or pushover or whatever
        this.log.info('send command');
        // Send response in callback if required
        if (obj.callback) this.sendTo(obj.from, obj.command, 'Message received', obj.callback);
      }
    }
  }

  private handleNotifiedError(error: Error, additionalData?: ErrorParameterAdditionsInterface): void {
    if (additionalData?.message) {
      this.log.error(`An unexpected exception occured: ${additionalData.message}
      > Details (if any): ${additionalData.details ?? 'none'}
      > The error message was: ${error.message}`);
    } else {
      this.log.error(`An unexpected exception occured: ${error.message}`);
    }
    this.log.debug(JSON.stringify(unpackError(error)));
    if (additionalData?.isCritical) {
      this.terminate(
        'The Adapter experienced a serious error and terminates now. See the log for corresponding errors and hints.',
        utils.EXIT_CODES.ADAPTER_REQUESTED_TERMINATION,
      );
    }
  }

  private prepareIocContainer(): void {
    const instanceConfig: InstanceConfigInterface = {
      instanceId: this.instance,
      instanceName: this.name,
    } as InstanceConfigInterface;

    iocContainer = createContainer<IocContainerInterface>({
      injectionMode: InjectionMode.CLASSIC,
      strict: false,
    });

    iocContainer.register({
      // ioB natives
      adapter: asValue(this),
      publicConfig: asValue(this.config),
      instanceConfig: asValue(instanceConfig),
      // gjsm
      objectClient: asClass(ObjectClient).transient(),
      logger: asClass(Logger).singleton(),
      yaml: asClass(Yaml).transient(),
      json: asClass(Json).transient(),
      jsonPath: asClass(JsonPath).transient(),
      configProvider: asClass(ConfigProvider).singleton(),
      specProvider: asClass(AutomationSpecProvider).singleton(),
      specProcessor: asClass(AutomationSpecProcessor).singleton(),
      autoRepository: asClass(AutomationRepository).singleton(),
      gjsm: asClass(GenericJsonStateManager).singleton(),
    });
  }
}

if (require.main !== module) {
  // Export the constructor in compact mode
  module.exports = (options: Partial<utils.AdapterOptions> | undefined) => new Gjsm(options);
} else {
  // otherwise start the instance directly
  (() => new Gjsm())();
}
