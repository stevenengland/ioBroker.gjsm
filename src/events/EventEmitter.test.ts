import { expect } from 'chai';
import { nameof } from '../utils/NameOf';
import { EventEmitter } from './EventEmitter';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type EventMap = {
  test: [testText: string, testNumber: number];
};

describe(nameof(EventEmitter), () => {
  describe('emit', () => {
    it(`Should emit and on should be triggered`, () => {
      // GIVEN
      let result1 = '';
      let result2 = 2;
      const sut = new EventEmitter<EventMap>();
      // WHEN
      sut.on('test', (testText, testNumber) => {
        result1 = testText;
        result2 = testNumber;
      });
      sut.emit('test', 'test', 1);
      // THEN
      expect(result1).to.equal('test');
      expect(result2).to.equal(1);
    });
    // Needed test for test coverage
    it(`Should emit and on should not be triggered`, () => {
      // GIVEN
      let result1 = '';
      let result2 = 2;
      const sut = new EventEmitter<EventMap>();
      // WHEN
      sut.emit('test', 'test', 1);
      sut.on('test', (testText, testNumber) => {
        result1 = testText;
        result2 = testNumber;
      });
      // THEN
      expect(result1).to.not.equal('test');
      expect(result2).to.not.equal(1);
    });
  });
});
