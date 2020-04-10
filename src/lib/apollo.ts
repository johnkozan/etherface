// Apollo GraphQL client

// ----------------------------------------------------------------------------
// IMPORTS

/* NPM */
import {
  InMemoryCache,
  NormalizedCacheObject,
  IntrospectionFragmentMatcher
} from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { ApolloLink, split } from "apollo-link";
import { onError } from "apollo-link-error";
import { HttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import { SubscriptionClient } from "subscriptions-transport-ws";

/* Local */
//import introspectionQueryResultData from "../graphql/fragments";
//import { LOCALSTORAGE_JWT } from "@/config";
//const LOCALSTORAGE_JWT = 'decentralhub';

// ----------------------------------------------------------------------------
//
const GRAPHQL = "http://localhost:5000/graphql";

// Match up fragments
//const fragmentMatcher = new IntrospectionFragmentMatcher({
  //introspectionQueryResultData
//});

export function createClient(): ApolloClient<NormalizedCacheObject> {
  // Create the cache first, which we'll share across Apollo tooling.
  // This is an in-memory cache. Since we'll be calling `createClient` on
  // universally, the cache will survive until the HTTP request is
  // responded to (on the server) or for the whole of the user's visit (in
  // the browser)
  //const cache = new InMemoryCache({ fragmentMatcher });
  const cache = new InMemoryCache();

  // Create a HTTP client (both server/client). It takes the GraphQL
  // server from the `GRAPHQL` environment variable, which by default is
  // set to an external playground at https://graphqlhub.com/graphql
  const httpLink = new HttpLink({
    credentials: "same-origin",
    uri: GRAPHQL
  });

  //const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    //const token = localStorage.getItem(LOCALSTORAGE_JWT);
    // return the headers to the context so httpLink can read them
    //const newHeaders = headers || {};
    //if (token) {
      //newHeaders.authorization = `Bearer ${token}`;
    //}
    //return {
      //headers: newHeaders
    //};
  //});

  //const combinedLinks = authLink.concat(httpLink);

  // If we're in the browser, we'd have received initial state from the
  // server. Restore it, so the client app can continue with the same data.
  //if (!SERVER) {
    //cache.restore((window as any).__APOLLO__);
  //}

  // Return a new Apollo Client back, with the cache we've just created,
  // and an array of 'links' (Apollo parlance for GraphQL middleware)
  // to tell Apollo how to handle GraphQL requests
  return new ApolloClient({
    cache,
    link: ApolloLink.from([
      // General error handler, to log errors back to the console.
      // Replace this in production with whatever makes sense in your
      // environment. Remember you can use the global `SERVER` variable to
      // determine whether you're running on the server, and record errors
      // out to third-party services, etc
      onError(({ graphQLErrors, networkError }) => {
        console.error(graphQLErrors, networkError);
        //if (graphQLErrors && graphQLErrors.filter(e => e).length > 0)
        //graphQLErrors.map(({ message = "", status = 200 }) => {
        //if (status === 401) {
        //console.warn(`You've attempted to access unauthorized section`);
        //}
        //if (status === 403) {
        //console.warn(`You've attempted a forbidden action`);
        //}
        //return null;
        //});
        //if (networkError && networkError.statusCode === 401) {
        // eslint-disable-next-line
        // TODO: Actually logout before rediecting to login
        //localStorage.removeItem(LOCALSTORAGE_JWT);
        //console.warn("Unauthorized");
        //}
        //if (networkError && networkError.statusCode === 403) {
        // Do something
        //console.warn("Forbidden");
        //}
        //if (networkError && networkError.statusCode >= 500) {
        // eslint-disable-next-line
        //console.warn("SERVER ERROR");
        //}
        }),

        // Split on HTTP and WebSockets
        split(
          ({ query }) => {
            const definition = getMainDefinition(query);
            return (
              definition.kind === "OperationDefinition" &&
              definition.operation === "subscription"
            );
          },
          // Use WebSockets for subscriptions
          new WebSocketLink(
            // Replace http(s) with `ws` for connecting via WebSockts
            new SubscriptionClient(GRAPHQL.replace(/^https?/, "ws"), {
              reconnect: true // <-- automatically redirect as needed
            })
          ),
          // ... fall-back to HTTP for everything else
          httpLink
        )
      ]),
    });
  }
