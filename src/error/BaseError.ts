export class BaseError extends Error {
  private _cause: Error | null;
  public constructor(msg: string, cause?: Error) {
    super(msg);
    this.name = this.constructor.name;
    this._cause = cause || null;

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, BaseError.prototype);
  }

  public get cause(): Error | null {
    return this._cause;
  }
}
