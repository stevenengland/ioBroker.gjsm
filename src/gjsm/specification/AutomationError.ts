import { BaseError } from '../../error/BaseError';

export class AutomationError extends BaseError {
  public constructor(msg: string) {
    super(msg);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, AutomationError.prototype);
  }
}
