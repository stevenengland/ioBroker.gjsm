import { expect } from 'chai';
import path from 'path';
import { nameof } from '../utils/NameOf';
import { BaseError } from './BaseError';
import * as ErrorHandling from './ErrorHandling';

describe(path.parse(__filename).name.split('.')[0], () => {
  describe(nameof(ErrorHandling.unpackError), () => {
    it(`Should create loggable object with all child errors`, () => {
      // GIVEN
      const error = new BaseError('1st level name', {
        cause: new BaseError('2nd level name', { cause: new Error('inerst') }),
      });
      // WHEN
      const result = ErrorHandling.unpackError(error) as BaseError;
      // THEN
      expect(result.message).to.equal('1st level name');
      expect((result.cause as Error).message).to.equal('2nd level name');
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
