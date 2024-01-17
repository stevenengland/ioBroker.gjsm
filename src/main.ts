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
import { unpackError } from './error/ErrorHandling';
import { ErrorParameterAdditionsInterface } from './error/ErrorParameterAdditionsInterface';
import { GenericJsonStateManagerInterface } from './gjsm/GenericJsonStateManagerInterface';
import { ConfigProviderInterface } from './gjsm/configuration/ConfigProviderInterface';
import { InstanceConfigInterface } from './gjsm/configuration/InstanceConfigInterface';
import { PublicConfigInterface } from './gjsm/configuration/PublicConfigInterface';
import { AutomationSpecProviderInterface } from './gjsm/specification/AutomationSpecProviderInterface';
import { ObjectClientInterface } from './iob/ObjectClientInterface';
import { LoggerInterface } from './logger/LoggerInterface';

interface IocContainerInterface {
  adapter: utils.AdapterInstance;
  publicConfig: PublicConfigInterface;
  instanceConfig: InstanceConfigInterface;
  objectClient: ObjectClientInterface;
  logger: LoggerInterface;
  yaml: DataFormatInterface;
  json: DataFormatInterface;
  configProvider: ConfigProviderInterface;
  specProvider: AutomationSpecProviderInterface;
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
        this.handleError(error, { isCritical: additionalData?.isCritical });
      });
      await this._gjsm.initialize();
    } catch (error) {
      if (error instanceof Error) {
        this.handleError(error, {
          message: `The adapter could not be initialized: ${error.message}`,
          isCritical: true,
        });
      } else {
        this.handleError(new Error('The adapter could not be initialized: Unknown error'), { isCritical: true });
      }
    }

    // Process the automation definitions
    await this._gjsm?.loadAutomationDefinitions();
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
  private onStateChange(id: string, state: ioBroker.State | null | undefined): void {
    if (state) {
      // The state was changed
      this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
    } else {
      // The state was deleted
      this.log.info(`state ${id} deleted`);
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

  private handleError(error: Error, additionalData?: ErrorParameterAdditionsInterface): void {
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
      configProvider: asClass(ConfigProvider).singleton(),
      specProvider: asClass(AutomationSpecProvider).singleton(),
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
