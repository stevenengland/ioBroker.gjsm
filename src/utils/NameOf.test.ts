import { expect } from 'chai';
import { nameof } from './NameOf';

class Test {
  public x = 1;
}

function testFunction() {
  return 1;
}

describe('nameof', () => {
  it(`Should tell string representation of class property`, () => {
    // GIVEN
    // WHEN
    const result = nameof<Test>((t) => t.x);
    // THEN
    expect(result).to.equal('x');
  });
  it(`Should tell string representation of classless function`, () => {
    // GIVEN
    // WHEN
    const result = nameof(testFunction);
    // THEN
    expect(result).to.equal('testFunction');
  });
});
