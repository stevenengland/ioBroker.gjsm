export interface DataFormatValidatorInterface {
  hasCorrectDataFormat(data: unknown): boolean;
  validateAgainstSchema(data: unknown, schema: object | string): void;
}
