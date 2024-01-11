import { expect } from 'chai';
import { nameof } from './NameOf';

class Test {
  public x: number = 1;
}

describe('nameof', () => {
  it(`Should tell string representation of class property`, () => {
    // GIVEN
    // WHEN
    const result = nameof<Test>((t) => t.x);
    // THEN
    expect(result).to.equal('x');
  });
});
