export class DataFormatError extends Error {
  constructor(msg: string) {
    super(msg);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, DataFormatError.prototype);
  }
}
