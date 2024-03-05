import { Theme } from '@mui/material/styles';
import { withStyles } from '@mui/styles';

import GenericApp from '@iobroker/adapter-react-v5/GenericApp';
import { GenericAppProps, GenericAppSettings } from '@iobroker/adapter-react-v5/types';
import { StyleRules } from '@mui/styles/withStyles';
import { AwilixContainer, InjectionMode, asClass, createContainer } from 'awilix';
import React from 'react';
import MainLayout from './components/MainLayout';
import { ContainerContext } from './contexts/ContainerContext';
import { IocContainerInterface } from './ioc/IocContainerInterface';
import { Translation } from './translation/Translation';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const styles = (_theme: Theme): StyleRules => ({
  root: {},
});

let iocContainer: AwilixContainer<IocContainerInterface>;

class TabApp extends GenericApp {
  public constructor(props: GenericAppProps) {
    const extendedProps: GenericAppSettings = {
      ...props,
      bottomButtons: false,
      encryptedFields: [],
      translations: {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        en: require('../i18n/en/translations.json') as Record<string, string>,
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        de: require('../i18n/de/translations.json') as Record<string, string>,
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        ru: require('../i18n/ru/translations.json') as Record<string, string>,
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        pt: require('../i18n/pt/translations.json') as Record<string, string>,
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        nl: require('../i18n/nl/translations.json') as Record<string, string>,
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        fr: require('../i18n/fr/translations.json') as Record<string, string>,
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        it: require('../i18n/it/translations.json') as Record<string, string>,
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        es: require('../i18n/es/translations.json') as Record<string, string>,
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        pl: require('../i18n/pl/translations.json') as Record<string, string>,
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        uk: require('../i18n/uk/translations.json') as Record<string, string>,
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        'zh-cn': require('../i18n/zh-cn/translations.json') as Record<string, string>,
      },
    };
    super(props, extendedProps);
  }

  public onConnectionReady(): void {
    // executed when connection is ready
  }

  public render() {
    if (!this.state.loaded) {
      return super.render();
    }

    this.prepareIocContainer();

    return (
      <div
        className="App"
        style={{
          background: this.state.theme.palette.background.default,
          color: this.state.theme.palette.text.primary,
        }}
      >
        <ContainerContext.Provider value={iocContainer}>
          <MainLayout />
          {this.renderError()}
          {this.renderToast()}
        </ContainerContext.Provider>
      </div>
    );
  }

  private prepareIocContainer(): void {
    iocContainer = createContainer<IocContainerInterface>({
      injectionMode: InjectionMode.CLASSIC,
      strict: false,
    });

    iocContainer.register({
      i18n: asClass(Translation).transient(),
    });
  }
}

export default withStyles(styles)(TabApp);
