import { expect } from 'chai';
import { nameof } from '../utils/NameOf';
import { BaseError } from './BaseError';
import * as ErrorHandling from './ErrorHandling';

describe('Error Handling functions', () => {
  beforeEach(() => {});
  afterEach(() => {});
  describe(nameof(ErrorHandling.unpackError), () => {
    it(`Should create loggable object with all child errors`, () => {
      // GIVEN
      const error = new BaseError('1st level name', {
        cause: new BaseError('2nd level name', { cause: new Error('inerst') }),
        isCritical: false,
      });
      // WHEN
      const result = ErrorHandling.unpackError(error) as BaseError;
      // THEN
      expect(result.message).to.equal('1st level name');
      expect(result.cause?.message).to.equal('2nd level name');
    });
    it(`Should return object of type any if no Error is given`, () => {
      // GIVEN
      const error = { test: 'test' };
      // WHEN
      const result = ErrorHandling.unpackError(error);
      // THEN
      expect(result).to.equal(error);
    });
  });
});
