import React from 'react';

import { Router } from 'react-router-dom';
import { createBrowserHistory } from "history";
import { Web3Provider } from '@ethersproject/providers'
import { Web3ReactProvider } from '@web3-react/core'
import { ToastProvider } from 'react-toast-notifications'

import { CustomToast } from './Notifications';
import { Layout } from './Layout';
import { Routes } from './Routes';
import { Loading } from './Loading';

import { AppTemplateProvider } from 'contexts/AppTemplateContext';

const history = createBrowserHistory();

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}


export default function App() {
  return (
    <Router history={history}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <ToastProvider components={{Toast: CustomToast}}>
          <AppTemplateProvider>
            <Loading>
              <Layout>
                <Routes />
              </Layout>
            </Loading>
          </AppTemplateProvider>
        </ToastProvider>
      </Web3ReactProvider>
    </Router>
  );
}
