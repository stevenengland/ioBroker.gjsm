import { render, screen } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';
import * as useInject from '../hooks/useInject';
import { IocContainerInterface } from '../ioc/IocContainerInterface';
import { Translation } from '../translation/Translation';
import AutomationList from './AutomationList';

describe('TMPTEST', function () {
  const i18nStub = sinon.createStubInstance(Translation);
  let useInjectStub: sinon.SinonStub<[identifier: keyof IocContainerInterface], unknown>;

  this.beforeEach(() => {
    useInjectStub = sinon.stub(useInject, 'useInject');
    useInjectStub.withArgs('i18n').returns(i18nStub);
  });

  this.afterEach(() => {
    useInjectStub.restore();
    sinon.reset();
  });

  it('Renders a heading', function () {
    // GIVEN
    i18nStub.translate.returns('test');
    // i18nStub.returns(sinon.createStubInstance(Translation));
    // WHEN
    render(<AutomationList items={['item1', 'item2', 'item3']} />);
    const items = screen.getAllByRole('heading');
    // THEN
    expect(items).to.have.length(1);
    expect(items[0].textContent).to.equal('test');
  });

  it('Renders list of items', function () {
    // GIVEN
    // WHEN
    render(<AutomationList items={['item1', 'item2', 'item3']} />);
    const items = screen.getAllByRole('listitem');
    // THEN
    expect(items).to.have.length(3);
  });
});
