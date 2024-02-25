import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import theme from '@iobroker/adapter-react-v5/Theme';
import Utils from '@iobroker/adapter-react-v5/Components/Utils';
import TabApp from './tab-app';

let themeName: string = Utils.getThemeName() as string;

function build(): void {
  ReactDOM.render(
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme(themeName)}>
        <TabApp
          adapterName="gjsm"
          onThemeChange={(theme: string) => {
            themeName = theme;
            build();
          }}
        />
      </ThemeProvider>
    </StyledEngineProvider>,
    document.getElementById('root'),
  );
}

build();
