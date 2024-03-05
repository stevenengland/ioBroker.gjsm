import { AdapterApiClientInterface } from '../adapter_api/AdapterApiClientInterface';
import { TranslationInterface } from '../translation/TranslationInterface';

export interface IocContainerInterface {
  i18n: TranslationInterface;
  apiClient: AdapterApiClientInterface;
}
