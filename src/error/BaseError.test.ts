import { expect } from 'chai';
import { nameof } from '../utils/NameOf';
import { BaseError } from './BaseError';

describe(nameof(BaseError), () => {
  describe('constructor', () => {
    it(`Should set ${nameof<BaseError>((b) => b.cause)}`, () => {
      // GIVEN
      const sut = new BaseError('msg', { cause: new Error('cause') });
      // WHEN
      // THEN
      expect((sut.cause as Error).message).to.equal('cause');
    });
  });
});
