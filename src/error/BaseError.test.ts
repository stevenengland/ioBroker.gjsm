import { expect } from 'chai';
import { nameof } from '../utils/NameOf';
import { BaseError } from './BaseError';

describe(nameof(BaseError), () => {
  beforeEach(() => {});
  afterEach(() => {});
  describe('constructor', () => {
    it(`Should set ${nameof<BaseError>((b) => b.cause)}`, () => {
      // GIVEN
      const sut = new BaseError('msg', new Error('cause'));
      // WHEN
      // THEN
      expect(sut.cause?.message).to.equal('cause');
    });
  });
});
