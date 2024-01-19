import { BaseError } from '../error/BaseError';

export class DataFormatError extends BaseError {
  public constructor(msg: string) {
    super(msg);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, DataFormatError.prototype);
  }
}
