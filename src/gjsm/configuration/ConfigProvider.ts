import { DataFormatInterface } from '../../data_format/DataFormatInterface';
import { ObjectClientInterface } from '../../iob/ObjectClientInterface';
import { config as privateConfig } from './Config';
import { ConfigError } from './ConfigError';
import { ConfigInterface } from './ConfigInterface';
import { ConfigProviderInterface } from './ConfigProviderInterface';
import { schema } from './ConfigSchema';
import { InstanceConfigInterface } from './InstanceConfigInterface';
import { PublicConfigInterface } from './PublicConfigInterface';
export class ConfigProvider implements ConfigProviderInterface {
  private _config!: ConfigInterface;
  private _publicConfig!: PublicConfigInterface;
  private readonly _instanceConfig!: InstanceConfigInterface;
  private readonly _json: DataFormatInterface;
  private readonly _objectClient: ObjectClientInterface;

  public constructor(
    json: DataFormatInterface,
    instanceConfig: InstanceConfigInterface,
    objectClient: ObjectClientInterface,
  ) {
    this._json = json;
    this._instanceConfig = instanceConfig;
    this._objectClient = objectClient;
  }

  public get schema(): object {
    return schema;
  }

  public get config(): ConfigInterface {
    return this._config;
  }

  public async loadConfig(config?: PublicConfigInterface): Promise<void> {
    if (config) {
      this._publicConfig = config;
    } else {
      const publicConfigObj = await this._objectClient.getForeignObjectAsync(
        `system.adapter.${this._instanceConfig.instanceName}.${this._instanceConfig.instanceId}`,
      );
      if (!publicConfigObj) {
        throw new ConfigError(
          `Could not load adapter config for instance ${this._instanceConfig.instanceName}.${this._instanceConfig.instanceId}`,
        );
      }
      this._publicConfig = publicConfigObj.native as PublicConfigInterface;
    }

    const unvalidatedConfig: ConfigInterface = {
      ...privateConfig,
      ...this._publicConfig,
      ...this._instanceConfig,
    } as ConfigInterface;

    await this._json.validateAgainstSchema(unvalidatedConfig, schema);
    this._config = unvalidatedConfig;
  }
}
