import { render, screen } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';
import { nameof } from '../../../src/utils/NameOf';
// import { useInject } from '../hooks/useInject';
import { AwilixContainer, InjectionMode, asValue, createContainer } from 'awilix';
import { ContainerContext } from '../contexts/ContainerContext';
// import * as useInject from '../hooks/useInject';
import { IocContainerInterface } from '../ioc/IocContainerInterface';
import { Translation } from '../translation/Translation';
import AutomationList from './AutomationList';

describe(nameof(AutomationList), function () {
  const i18nStub = sinon.createStubInstance(Translation);

  function prepareIocContainer(): AwilixContainer<IocContainerInterface> {
    const iocContainer = createContainer<IocContainerInterface>({
      injectionMode: InjectionMode.CLASSIC,
      strict: false,
    });

    iocContainer.register({
      i18n: asValue(i18nStub),
    });

    return iocContainer;
  }

  this.afterEach(() => {
    sinon.reset();
  });

  it('Renders a heading', function () {
    // GIVEN
    i18nStub.translate.returns('test');
    // i18nStub.returns(sinon.createStubInstance(Translation));
    // WHEN
    render(
      <ContainerContext.Provider value={prepareIocContainer()}>
        <AutomationList items={['item1', 'item2', 'item3']} />
      </ContainerContext.Provider>,
    );
    const items = screen.getAllByRole('heading');
    // THEN
    expect(items).to.have.length(1);
    expect(items[0].textContent).to.equal('test');
  });

  it('Renders list of items', function () {
    // GIVEN
    // WHEN
    render(
      <ContainerContext.Provider value={prepareIocContainer()}>
        <AutomationList items={['item1', 'item2', 'item3']} />
      </ContainerContext.Provider>,
    );
    const items = screen.getAllByRole('listitem');
    // THEN
    expect(items).to.have.length(3);
  });
});
