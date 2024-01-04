import { expect } from 'chai';
import { DataFormatError } from './DataFormatError';
import { Json } from './Json';

describe('JSON', () => {
  let sut: Json;
  beforeEach(() => {
    sut = new Json();
  });
  describe('hasCorrectDataFormat', () => {
    (
      [
        [false, 'true'],
        [false, 3],
        [true, '{"x":true}'],
        [true, '[1, false, null]'],
        [false, '-'], // Invalid JSON
      ] as Array<[boolean, string]>
    ).forEach(([expected, input]) => {
      it(`should return ${expected} when ${input} is given`, () => {
        // GIVEN
        // WHEN
        const result = sut.hasCorrectDataFormat(input);

        // THEN
        expect(result).equal(expected);
      });
    });
  });
  describe('parse', () => {
    (
      [
        [true, 'true'],
        [3, 3],
        [{ x: true }, '{"x":true}'],
        [[1, false, null], '[1, false, null]'],
      ] as Array<[boolean, string]>
    ).forEach(([expected, input]) => {
      it(`should return ${expected} when ${input} is given`, () => {
        // GIVEN
        // WHEN
        const result = sut.parse(input);

        // THEN
        expect(result).deep.equal(expected);
      });
    });
    it(`should throw when invalid JSON doc is given`, () => {
      // GIVEN
      // WHEN
      function when() {
        sut.parse('-');
      }

      // THEN
      expect(when).to.throw(DataFormatError, /Invalid \(JSON\) syntax/);
    });
  });
});
