import * as chai from 'chai';
import { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { DataFormatError } from './DataFormatError';
import { Yaml } from './Yaml';
chai.use(chaiAsPromised);

describe('YAML', () => {
  let sut: Yaml;
  beforeEach(() => {
    sut = new Yaml();
  });
  describe('hasCorrectDataFormat', () => {
    (
      [
        [false, 'true'],
        [false, 3],
        [true, '{"x":true}'],
        [true, '[1, false, null]'],
        [true, [1, false, null]],
        [false, ','], // Invalid YAML
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
        sut.parse(',');
      }

      // THEN
      expect(when).to.throw(DataFormatError, /Invalid YAML/);
    });
  });
  describe('validateAgainstSchema', () => {
    (
      [
        [
          {
            foo: 1,
            bar: 'abc',
          },
        ],
      ] as Array<[object | string]>
    ).forEach(([input]) => {
      it(`should succeed when ${JSON.stringify(input)} is given`, () => {
        // GIVEN
        const schema = {
          type: 'object',
          properties: {
            foo: { type: 'integer' },
            bar: { type: 'string' },
          },
          required: ['foo'],
          additionalProperties: false,
        };
        // WHEN
        async function when() {
          await sut.validateAgainstSchema(input, schema);
        }
        // THEN
        expect(when).to.not.throw();
      });
    });
    (
      [
        [
          {
            foo: 'one',
            bar: 'abc',
          },
        ],
        [
          {
            bar: 'abc',
          },
        ],
      ] as Array<[object | string]>
    ).forEach(([input]) => {
      it(`should throw when ${JSON.stringify(input)} as invalid data is given`, async () => {
        // GIVEN
        const schema = {
          type: 'object',
          properties: {
            foo: { type: 'integer' },
            bar: { type: 'string' },
          },
          required: ['foo'],
          additionalProperties: false,
        };
        // WHEN
        async function when() {
          return sut.validateAgainstSchema(input, schema);
        }
        // THEN
        await expect(when()).to.be.rejectedWith(DataFormatError);
      });
    });
  });
});
