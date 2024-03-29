import { expect } from 'chai';
import { JsonPath } from './JsonPath';

describe('JsonPathLib', () => {
  const testobject = {
    key1: false,
    key2: 'string',
  };
  const testJson = JSON.stringify(testobject);
  let sut: JsonPath;

  beforeEach(() => {
    sut = new JsonPath();
  });
  describe('getValues', () => {
    (
      [
        [false, '$.key1', 0],
        ['string', '$.key2', 0],
        [undefined, '$.notexisting', 0],
        [[], '$.notexisting', -1],
      ] as [unknown, string, number][]
    ).forEach(([expected, input, testIndex]) => {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      it(`should return ${expected} when ${input} is given`, () => {
        // GIVEN
        // WHEN
        const result = sut.getValues(input, testJson);

        // THEN
        if (testIndex === -1) {
          expect(result).deep.equal(expected);
        } else {
          expect(result[testIndex]).equal(expected);
        }
      });
    });
  });
});
