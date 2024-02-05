import { ConfigInterface } from './ConfigInterface';
import { PublicConfigInterface } from './PublicConfigInterface';

export interface ConfigProviderInterface {
  config: ConfigInterface;
  schema: object;
  loadConfig(config?: PublicConfigInterface): Promise<void>;
}
