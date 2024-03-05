import I18n from '@iobroker/adapter-react-v5/i18n';
import { TranslationInterface } from './TranslationInterface';

export class Translation implements TranslationInterface {
  public translate(key: string, ...args: string[]): string {
    return I18n.t(key, ...args);
  }
}
