import { expect } from 'chai';
import { JsonPathLib } from './JsonPathLib';

describe('JsonPathLib', () => {
    const testobject = {
        key1: false,
        key2: 'string',
    };
    const testJson = JSON.stringify(testobject);
    let sut: JsonPathLib;

    beforeEach(() => {
        sut = new JsonPathLib();
    });
    describe('getValues', () => {
        (
            [
                [false, '$.key1', 0],
                ['string', '$.key2', 0],
                [undefined, '$.notexisting', 0],
                [[], '$.notexisting', -1],
            ] as Array<[unknown, string, number]>
        ).forEach(([expected, input, testIndex]) => {
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
