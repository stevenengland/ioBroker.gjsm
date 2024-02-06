import { BaseObjectInterface } from './BaseObjectInterface';
import { EnumCommonInterface } from './EnumCommonInterface';

export interface EnumObjectInterface extends BaseObjectInterface {
  type: 'enum';
  common: EnumCommonInterface;
}
