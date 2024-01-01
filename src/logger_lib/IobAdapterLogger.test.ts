// import * as utils from '@iobroker/adapter-core';
import { AdapterInstance } from '@iobroker/adapter-core';
import { MockAdapter, utils } from '@iobroker/testing';
import { expect } from 'chai';
import { IobAdapterLogger } from './IobAdapterLogger';

describe('IobLogger', () => {
    let sut: IobAdapterLogger;
    let adapter: MockAdapter;
    // let adapter2: AdapterInstance;

    beforeEach(() => {
        adapter = utils.unit.createMocks({ name: 'gsjm' }).adapter;
        sut = new IobAdapterLogger(adapter as unknown as AdapterInstance);
    });

    afterEach(() => {
        // jest.restoreAllMocks();
        adapter.resetMock();
    });

    it('should debug', () => {
        // GIVEN
        // WHEN
        sut.debug('debugtest');
        // THEN
        expect(adapter.log.debug).calledWithMatch('debugtest');
    });
    it('should info', () => {
        // GIVEN
        // WHEN
        sut.info('infotest');

        // THEN
        expect(adapter.log.info).calledWithMatch('infotest');
    });
    it('should warn', () => {
        // GIVEN
        // WHEN
        sut.warn('warntest');

        // THEN
        expect(adapter.log.warn).calledWithMatch('warntest');
    });
    it('should error', () => {
        // GIVEN
        // WHEN
        sut.error('errortest');

        // THEN
        expect(adapter.log.error).calledWithMatch('errortest');
    });
});
