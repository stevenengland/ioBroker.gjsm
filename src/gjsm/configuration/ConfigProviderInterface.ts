import { ConfigInterface } from './ConfigInterface';

export interface ConfigProviderInterface {
  config: ConfigInterface;
  schema: object;
  loadConfig(): Promise<void>;
}
