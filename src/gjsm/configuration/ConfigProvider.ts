import { DataFormatInterface } from '../../data_format/DataFormatInterface';
import { config as privateConfig } from '../Config';
import { schema } from '../ConfigSchema';
import { ConfigInterface } from './ConfigInterface';
import { ConfigProviderInterface } from './ConfigProviderInterface';
import { PublicConfigInterface } from './PublicConfigInterface';
export class ConfigProvider implements ConfigProviderInterface {
  private _config: ConfigInterface;
  private _json: DataFormatInterface;

  public constructor(publicConfig: PublicConfigInterface, json: DataFormatInterface) {
    this._json = json;
    const unvalidatedConfig: ConfigInterface = { ...privateConfig, ...publicConfig } as ConfigInterface;
    this._json.validateAgainstSchema(unvalidatedConfig, schema);
    this._config = unvalidatedConfig;
  }
  public get schema(): object {
    return schema;
  }

  public get config(): ConfigInterface {
    return this._config;
  }
}
