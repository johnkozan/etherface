import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import App from './App';
import theme from './theme';

// HOC for enabling Apollo GraphQL `<Query>` and `<Mutation>`
//import { ApolloProvider } from "@apollo/react-hooks";

// Helper function that creates a new Apollo client per request
//import { createClient } from "./lib/apollo";

// Create Apollo client
//const client = createClient();
  //<ApolloProvider client={client}>
//</ApolloProvider>,

ReactDOM.render(
  <ThemeProvider theme={theme}>
    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
    <CssBaseline />
    <App />
  </ThemeProvider>,
  document.querySelector('#root'),
);
