import { ErrorParameterAdditionsInterface } from '../error/ErrorParameterAdditionsInterface';

export type GenericJsonStateMapperEventMap = {
  error: [error: Error, additionalData?: ErrorParameterAdditionsInterface];
};
