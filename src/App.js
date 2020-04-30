import React from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';


import { Router } from 'react-router-dom';
import { createBrowserHistory } from "history";
import { Web3Provider } from '@ethersproject/providers'
import { Web3ReactProvider } from '@web3-react/core'

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
        <AppTemplateProvider>
          <Container fixed>
            <Loading>
              <Layout>
                <Routes />
              </Layout>
            </Loading>
          </Container>
        </AppTemplateProvider>
      </Web3ReactProvider>
    </Router>
  );
}
