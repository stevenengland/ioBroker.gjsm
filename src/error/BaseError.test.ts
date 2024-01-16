import { expect } from 'chai';
import { nameof } from '../utils/NameOf';
import { BaseError } from './BaseError';

describe(nameof(BaseError), () => {
  beforeEach(() => {});
  afterEach(() => {});
  describe('constructor', () => {
    it(`Should set ${nameof<BaseError>((b) => b.cause)}`, () => {
      // GIVEN
      const sut = new BaseError('msg', { cause: new Error('cause') });
      // WHEN
      // THEN
      expect(sut.cause?.message).to.equal('cause');
    });
    it(`Should set ${nameof<BaseError>((b) => b.isCritical)}`, () => {
      // GIVEN
      const sut = new BaseError('msg', { isCritical: true });
      // WHEN
      // THEN
      expect(sut.isCritical).to.equal(true);
    });
  });
});
