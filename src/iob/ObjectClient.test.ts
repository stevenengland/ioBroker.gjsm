import { AdapterInstance } from '@iobroker/adapter-core';
import { MockAdapter, MockDatabase, utils } from '@iobroker/testing';
import { expect } from 'chai';
import sinon from 'sinon';
import { delay } from '../../test/integration_tests/TestTools';
import { nameof } from '../utils/NameOf';
import { ObjectClient } from './ObjectClient';
import { State } from './State';
import { StateFactory } from './State.Factory.test';

describe(nameof(ObjectClient), () => {
  let sut: ObjectClient;
  let adapter: MockAdapter;
  let database: MockDatabase;

  const testRecord: Record<string, ioBroker.State> = {
    test: { val: 1, ack: true, ts: 123, lc: 123, from: 'system.adapter.test.0', q: 0, expire: 123 },
    test2: { val: 2, ack: true, ts: 123, lc: 123, from: 'system.adapter.test.0', q: 0, expire: 123 },
    test_null: null as unknown as ioBroker.State,
  };

  const testState: ioBroker.State = {
    val: 1,
    ack: true,
    ts: 123,
    lc: 123,
    from: 'system.adapter.test.0',
    q: 0,
    expire: 123,
  };

  beforeEach(() => {
    const mocks = utils.unit.createMocks({ name: 'gsjm' });
    database = mocks.database;
    adapter = mocks.adapter as unknown as MockAdapter;
    sut = new ObjectClient(adapter as unknown as AdapterInstance);
  });

  afterEach(() => {
    adapter.resetMock();
    database.clear();
  });

  describe(
    nameof<ObjectClient>((s) => s.getStatesAsync),
    () => {
      it(`Should return states`, async () => {
        // GIVEN
        adapter.getStatesAsync.resolves(testRecord);
        // WHEN
        const result = await sut.getStatesAsync('*');
        // THEN
        expect(result[0].id).to.equal('test');
        expect(result[1].id).to.equal('test2');
        expect(result[2]).to.be.undefined;
      });
    },
  );
  describe(
    nameof<ObjectClient>((s) => s.getForeignStateAsync),
    () => {
      it(`Should return state`, async () => {
        // GIVEN
        adapter.getForeignStateAsync.resolves(testState);
        // WHEN
        const result = await sut.getForeignStateAsync('test');
        // THEN
        expect(result?.id).to.equal('test');
      });
    },
  );
  describe(
    nameof<ObjectClient>((s) => s.getForeignStatesAsync),
    () => {
      it(`Should return states that are not null`, async () => {
        // GIVEN
        // TODO: Remove hack after https://github.com/ioBroker/testing/issues/591 is fixed
        class tmpAdapter {
          public async getForeignStatesAsync(pattern: string): Promise<Record<string, ioBroker.State>> {
            await delay(1);
            return {
              test: { val: pattern, ack: true, ts: 123, lc: 123, from: 'system.adapter.test.0', q: 0, expire: 123 },
            };
          }
        }
        const tmpAdapterMock = sinon.createStubInstance(tmpAdapter);
        const tmpSut = new ObjectClient(tmpAdapterMock as unknown as AdapterInstance);
        tmpAdapterMock.getForeignStatesAsync.resolves(testRecord);
        // WHEN
        const result = await tmpSut.getForeignStatesAsync('test');
        // THEN
        expect(result[0].id).to.equal('test');
        expect(result[1].id).to.equal('test2');
        expect(result[2]).to.be.undefined;
      });
    },
  );
  describe(
    nameof<ObjectClient>((s) => s.setStateAsync),
    () => {
      it(`Should set state`, async () => {
        // GIVEN
        // WHEN
        await sut.setStateAsync(StateFactory.state());
        // THEN
        expect(adapter.setStateAsync).to.be.calledOnce;
      });
    },
  );
  describe(
    nameof<ObjectClient>((s) => s.setForeignStateAsync),
    () => {
      it(`Should set state`, async () => {
        // GIVEN
        // WHEN
        await sut.setForeignStateAsync(StateFactory.state());
        // THEN
        expect(adapter.setForeignStateAsync).to.be.calledOnce;
      });
    },
  );
  describe(
    nameof<ObjectClient>((s) => s.existsStateAsync),
    () => {
      it(`Should return true if exists`, async () => {
        // GIVEN
        adapter.getForeignStateAsync.resolves(testRecord);
        // WHEN
        const result = await sut.existsStateAsync('*');
        // THEN
        expect(result).to.be.true;
      });
      it(`Should return false if not exists`, async () => {
        // GIVEN
        adapter.getForeignStateAsync.resolves(null);
        // WHEN
        const result = await sut.existsStateAsync('*');
        // THEN
        expect(result).to.be.false;
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
        const result = (await sut.getForeignObjectAsync('*')) as ioBroker.BaseObject;
        // THEN
        expect(result._id).to.equal('system.adapter.test.0');
      });
      it(`Should return object with more properties than an object interface`, async () => {
        // GIVEN
        const record: ioBroker.EnumObject = {
          _id: 'system.adapter.test.0',
          native: { test: 1 },
          common: {
            members: ['test'],
            name: '',
          },
          type: 'enum',
        };
        adapter.getForeignObjectAsync.resolves(record);
        // WHEN
        const result = (await sut.getForeignObjectAsync('*')) as ioBroker.EnumObject;
        // THEN
        expect(result._id).to.equal('system.adapter.test.0');
        expect(result.common.members![0]).to.equal('test');
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
  describe(
    nameof<ObjectClient>((s) => s.subscribeForeignStatesAsync),
    () => {
      it(`Should not throw`, async () => {
        // GIVEN
        // WHEN
        async function when() {
          await sut.subscribeForeignStatesAsync('*');
        }
        // THEN
        await expect(when()).not.to.be.rejected;
      });
    },
  );
  describe(
    nameof<ObjectClient>((o) => o.getStateName),
    () => {
      (
        [
          ['IPADDR', 'alias.0.sp_dachboden_switch.IPADDR'],
          ['IP_ADDR', 'alias.0.sp_dachboden_switch.IP_ADDR'],
          ['', 'alias_0_sp_dachboden_switch_IP_ADDR'],
        ] as [string, string][]
      ).forEach(([expected, input]) => {
        it(`should return ${expected} when ${input} is given`, () => {
          // GIVEN
          // WHEN
          const result = sut.getStateName(input);
          // THEN
          expect(result).to.equal(expected);
        });
      });
    },
  );
  describe(
    nameof<ObjectClient>((o) => o.getStateParentId),
    () => {
      ([['alias.0.sp_dachboden_switch', 'alias.0.sp_dachboden_switch.IPADDR']] as [string, string][]).forEach(
        ([expected, input]) => {
          it(`should return ${expected} when ${input} is given`, () => {
            // GIVEN
            // WHEN
            const result = sut.getStateParentId(input);
            // THEN
            expect(result).to.equal(expected);
          });
        },
      );
    },
  );
  describe(
    nameof<ObjectClient>((o) => o.getStateSiblingsIds),
    () => {
      it('should return siblings', async () => {
        // GIVEN
        const records: Record<string, State> = {
          id0: StateFactory.state(),
          id1: StateFactory.state(),
        };
        adapter.getStatesAsync.resolves(records);
        // WHEN
        const result = await sut.getStateSiblingsIds('test');
        // THEN
        expect(result[0]).to.equal('id0');
        expect(result[1]).to.equal('id1');
      });
    },
  );
  describe(
    nameof<ObjectClient>((o) => o.isObjectOfTypeState),
    () => {
      it('should return true if object is a state', async () => {
        // GIVEN
        const records = { type: 'state' };
        adapter.getForeignObjectAsync.resolves(records);
        // WHEN
        const result = await sut.isObjectOfTypeState('test');
        // THEN
        expect(result).to.be.true;
      });
      it('should return false if object is not a state', async () => {
        // GIVEN
        const records = { type: 'folder' };
        adapter.getForeignObjectAsync.resolves(records);
        // WHEN
        const result = await sut.isObjectOfTypeState('test');
        // THEN
        expect(result).to.be.false;
      });
    },
  );
});
