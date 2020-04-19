import React from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';

import { Router } from 'react-router-dom';
import { createBrowserHistory } from "history";
import { Layout } from './Layout';
import { Routes } from './Routes';

import { AppTemplateProvider } from './AppTemplateStore';

import { Loading } from './Loading';

const history = createBrowserHistory();

export default function App() {
  return (
    <Router history={history}>
      <AppTemplateProvider>
        <Container fixed>
          <Loading>
            <Layout>
              <Routes />
            </Layout>
          </Loading>
        </Container>
      </AppTemplateProvider>
    </Router>
  );
}
