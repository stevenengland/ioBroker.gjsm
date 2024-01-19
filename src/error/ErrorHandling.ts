import { BaseError } from './BaseError';

export function unpackError(error: unknown): unknown {
  // If this isn't an instance of the Error object, just return it - we don't know
  // enough about it, otherwise, to be able to ensure key transfers.
  if (!(error instanceof Error)) {
    return error;
  }

  const errorData = {
    name: error.name,
    message: error.message,
    stack: error.stack,
    cause: {} as unknown,
  };

  if (error instanceof BaseError && error.cause) {
    errorData.cause = unpackError(error.cause);
  }

  return errorData;
}
