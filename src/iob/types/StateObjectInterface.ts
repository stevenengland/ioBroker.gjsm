import { BaseObjectInterface } from './BaseObjectInterface';
import { StateCommonInterface } from './StateCommonInterface';

export interface StateObjectInterface extends BaseObjectInterface {
  type: 'state';
  common: StateCommonInterface;
}
