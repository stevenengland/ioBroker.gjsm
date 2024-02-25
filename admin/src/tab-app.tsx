import React from 'react';
import { Theme, withStyles } from '@material-ui/core/styles';

import GenericApp from '@iobroker/adapter-react/GenericApp';
import { GenericAppProps, GenericAppSettings } from '@iobroker/adapter-react/types';
import { StyleRules } from '@material-ui/core/styles';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const styles = (_theme: Theme): StyleRules => ({
  root: {},
});

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
        // uk: require('../i18n/uk/translations.json') as Record<string, string>,
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

    return (
      <div className="App">
        TEST TAB
        {this.renderError()}
        {this.renderToast()}
      </div>
    );
  }
}

export default withStyles(styles)(TabApp);
