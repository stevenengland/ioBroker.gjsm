import { BaseError } from '../error/BaseError';

export class IobError extends BaseError {
  public constructor(msg: string) {
    super(msg);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, IobError.prototype);
  }
}
