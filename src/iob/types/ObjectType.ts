import { AnyObject } from './AnyObject';

export type ObjectType = AnyObject & {
  native: object;
  common: object;
};
