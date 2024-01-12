import { AdapterInstance } from '@iobroker/adapter-core';
import { MockAdapter, utils } from '@iobroker/testing';
import { expect } from 'chai';
import { nameof } from '../utils/NameOf';
import { ObjectClient } from './ObjectClient';

describe(nameof(ObjectClient), () => {
  let sut: ObjectClient;
  let adapter: MockAdapter;

  beforeEach(() => {
    adapter = utils.unit.createMocks({ name: 'gsjm' }).adapter;
    sut = new ObjectClient(adapter as unknown as AdapterInstance);
  });

  afterEach(() => {
    adapter.resetMock();
  });
  describe(
    nameof<ObjectClient>((s) => s.getStatesAsync),
    () => {
      it(`Should return states`, async () => {
        // GIVEN
        const record: Record<string, ioBroker.State> = {
          test: { val: 1, ack: true, ts: 123, lc: 123, from: 'system.adapter.test.0', q: 0, expire: 123 },
        };
        adapter.getStatesAsync.resolves(record);
        // WHEN
        const result = await sut.getStatesAsync('*');
        // THEN
        expect(result[0].id).to.equal('test');
      });
    },
  );
  describe(
    nameof<ObjectClient>((s) => s.getForeignObjectAsync),
    () => {
      it(`Should return object`, async () => {
        // GIVEN
        const record: object = {
          _id: 'system.adapter.test.0',
          native: { test: 1 },
        };
        adapter.getForeignObjectAsync.resolves(record);
        // WHEN
        const result = await sut.getForeignObjectAsync('*');
        // THEN
        expect(result?.id).to.equal('system.adapter.test.0');
      });
      it(`Should return null`, async () => {
        // GIVEN
        adapter.getForeignObjectAsync.resolves(null);
        // WHEN
        const result = await sut.getForeignObjectAsync('*');
        // THEN
        expect(result).to.equal(null);
      });
    },
  );
  describe(
    nameof<ObjectClient>((s) => s.subscribeStatesAsync),
    () => {
      it(`Should not throw`, async () => {
        // GIVEN
        // WHEN
        async function when() {
          await sut.subscribeStatesAsync('*');
        }
        // THEN
        await expect(when()).not.to.be.rejected;
      });
    },
  );
});
