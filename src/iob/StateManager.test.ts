import { AdapterInstance } from '@iobroker/adapter-core';
import { MockAdapter, utils } from '@iobroker/testing';
import { expect } from 'chai';
import { nameof } from '../utils/NameOf';
import { StateManager } from './StateManager';

describe(nameof(StateManager), () => {
  let sut: StateManager;
  let adapter: MockAdapter;

  beforeEach(() => {
    adapter = utils.unit.createMocks({ name: 'gsjm' }).adapter;
    sut = new StateManager(adapter as unknown as AdapterInstance);
  });

  afterEach(() => {
    adapter.resetMock();
  });
  describe(
    nameof<StateManager>((s) => s.getStatesAsync),
    () => {
      it(`Should return states`, async () => {
        // GIVEN
        const record: Record<string, unknown> = {
          test: { val: 1, ack: true, ts: 123 },
        };
        adapter.getStatesAsync.resolves(record);
        // WHEN
        const result = await sut.getStatesAsync('*');
        // THEN
        expect(result[0].id).to.equal('test');
      });
    },
  );
});
