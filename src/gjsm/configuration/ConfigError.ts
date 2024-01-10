export class ConfigError extends Error {
  public constructor(msg: string) {
    super(msg);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ConfigError.prototype);
  }
}
