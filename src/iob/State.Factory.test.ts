import { faker } from '@faker-js/faker';
import { State, StateValueType } from './State';

interface Builder {
  withVal(val: unknown): this;
  withId(id: string): this;
  withTs(timestamp: number): this;
  build(): State;
}

export class StateBuilder implements Builder {
  private readonly state: State;

  public constructor(state?: State) {
    this.state = typeof state !== 'undefined' ? state : new State();
  }
  public withVal(val?: StateValueType): this {
    this.state.val = typeof val !== 'undefined' ? val : faker.string.alpha(100);
    return this;
  }
  public withId(id?: string): this {
    this.state.id = typeof id !== 'undefined' ? id : faker.helpers.fromRegExp(/adapter.[0-9]{1}.id_[0-9]{5}/);
    return this;
  }
  public withTs(timestamp?: number): this {
    this.state.ts =
      typeof timestamp !== 'undefined' ? timestamp : faker.number.int({ min: 1697666400, max: 1697666999 });
    return this;
  }
  public build() {
    return this.state;
  }
}

export class StateFactory {
  public static state(state?: State): State {
    const builder = typeof state !== 'undefined' ? new StateBuilder(state) : new StateBuilder();
    return builder.withId().withTs().withVal().build();
  }
  public static states(count: number): State[] {
    const result = new Array<State>();
    for (let i = 0; i < count; i++) {
      result.push(this.state());
    }
    return result;
  }
  public static stateWithVal(val: StateValueType): State {
    const result = this.state();
    result.val = val;
    return result;
  }
  public static statesWithId(count: number, id: string): State[] {
    const result = new Array<State>();
    for (let i = 0; i < count; i++) {
      const state = this.state();
      state.id = id;
      result.push(state);
    }
    return result;
  }
  public static statesWithPrefixedId(count: number, prefix: string = ''): State[] {
    const result = new Array<State>();
    for (let i = 0; i < count; i++) {
      const state = this.state();
      state.id = prefix + 'id_' + i;
      result.push(state);
    }
    return result;
  }
  public static stateWithInvalidJsonAsVal(): State {
    const state = this.state();
    state.val = '-invalid-';
    return state;
  }
}
