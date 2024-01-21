import { expect } from 'chai';
import { nameof } from '../utils/NameOf';
import { State } from './State';
import { StateValueType } from './StateValueType';

describe('State', () => {
  describe(
    nameof<State>((s) => s.setTimeStamp),
    () => {
      (
        [
          [1697799600, '2023-10-20T11:00:00Z'],
          [1697799600, '2023-10-20 11:00:00Z'],
          [NaN, '2023-19-99 99:99:99'],
          [NaN, false],
          [1111, 1111],
        ] as [number, StateValueType][]
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
    },
  );
});
