import { ErrorParameterInterface } from './ErrorParameterInterface';

export class BaseError extends Error {
  private readonly _cause: Error | null;
  private readonly _isCritical: boolean = false;

  public constructor(msg: string, errorParams?: ErrorParameterInterface) {
    super(msg);
    this.name = this.constructor.name;
    this._cause = errorParams?.cause || null;
    this._isCritical = errorParams?.isCritical || false;

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, BaseError.prototype);
  }

  public get cause(): Error | null {
    return this._cause;
  }

  public get isCritical(): boolean {
    return this._isCritical;
  }
}
