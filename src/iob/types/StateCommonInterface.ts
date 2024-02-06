import { CommonType } from './CommonType';
import { ObjectCommonInterface } from './ObjectCommonInterface';

export interface StateCommonInterface extends ObjectCommonInterface {
  read: boolean;
  write: boolean;
  role: string;
  type: CommonType;
}
