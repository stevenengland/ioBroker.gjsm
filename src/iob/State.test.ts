import { expect } from 'chai';
import { State, StateValueType } from './State';

describe('State', () => {
  describe('setTimeStamp', () => {
    (
      [
        [1697792400, '2023-10-20T11:00:00'],
        [1697792400, '2023-10-20 11:00:00'],
        [NaN, '2023-19-99 99:99:99'],
        [NaN, false],
        [1111, 1111],
      ] as Array<[number, StateValueType]>
    ).forEach(([expected, input]) => {
      it(`should return ${expected} with state timestamp of ${input} given`, () => {
        // GIVEN
        const state = new State({
          val: input,
        });
        // WHEN
        state.setTimeStamp(input);

        // THEN
        expect(state.ts).deep.equal(expected);
      });
    });
  });
});
