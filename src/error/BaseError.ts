import { ErrorParameterInterface } from './ErrorParameterInterface';

export class BaseError extends Error {
  private readonly _cause: unknown;

  public constructor(msg: string, errorParams?: ErrorParameterInterface) {
    super(msg);
    this.name = this.constructor.name;
    this._cause = errorParams?.cause ?? null;

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, BaseError.prototype);
  }

  public get cause(): unknown {
    return this._cause;
  }
}
