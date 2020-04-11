import React, { useContext, useEffect } from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';

import { Router } from 'react-router-dom';
import { createBrowserHistory } from "history";
import { Layout } from './Layout';
import { Routes } from './Routes';

import { AppTemplateProvider, AppTemplateStore } from './AppTemplateStore';

import { useActions } from './actions';

import exampleTemplate from './example.json';

const history = createBrowserHistory();

const LoadDefault = () => {
  const { state, dispatch } = useContext(AppTemplateStore);
  const { loadAppTemplate } = useActions(state, dispatch);

  useEffect(() => {
    loadAppTemplate(exampleTemplate);
  }, []);

  return null;
}

export default function App() {
  return (
    <Router history={history}>
      <AppTemplateProvider>
        <LoadDefault />
        <Container>
          <Box my={4}>
            <Layout>
              <Routes />
            </Layout>
          </Box>
        </Container>
      </AppTemplateProvider>
    </Router>
  );
}
