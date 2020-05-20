import React from 'react';

import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from "history";
import { Web3Provider } from '@ethersproject/providers'
import { Web3ReactProvider } from '@web3-react/core'
import { ToastProvider } from 'react-toast-notifications'

import theme from './theme';
import { CustomToast } from './Notifications';
import { Layout } from './Layout';
import { Routes } from './Routes';
import { Loading } from './Loading';

import { Web3ContextProvider } from './contexts/Web3Context';
import { AppTemplateProvider } from './contexts/AppTemplateContext';

const history = createBrowserHistory();

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}


export default function App({ storage }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router history={history}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <ToastProvider components={{Toast: CustomToast}}>
            <Web3ContextProvider>
              <AppTemplateProvider storage={storage}>
                <Loading storage={storage}>
                  <Layout>
                    <Routes />
                  </Layout>
                </Loading>
              </AppTemplateProvider>
            </Web3ContextProvider>
          </ToastProvider>
        </Web3ReactProvider>
      </Router>
    </ThemeProvider>
  );
}
