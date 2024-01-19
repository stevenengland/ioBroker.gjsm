import { ErrorParameterAdditionsInterface } from '../error/ErrorParameterAdditionsInterface';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type GenericJsonStateMapperEventMap = {
  error: [error: Error, additionalData?: ErrorParameterAdditionsInterface];
};
