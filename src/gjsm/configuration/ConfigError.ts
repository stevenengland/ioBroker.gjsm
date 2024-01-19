import { BaseError } from '../../error/BaseError';

export class ConfigError extends BaseError {
  public constructor(msg: string) {
    super(msg);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ConfigError.prototype);
  }
}
