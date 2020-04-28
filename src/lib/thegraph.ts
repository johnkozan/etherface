import { useState, useEffect } from 'react';
import {
  InMemoryCache,
  NormalizedCacheObject,
} from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { onError } from "apollo-link-error";
import { HttpLink } from "apollo-link-http";
//import { WebSocketLink } from "apollo-link-ws";
//import { getMainDefinition } from "apollo-utilities";
//import { SubscriptionClient } from "subscriptions-transport-ws";

import  fetchGraphqlSchema from 'fetch-graphql-schema';

export function connectTheGraph(uri: string): ApolloClient<NormalizedCacheObject> {
  // Create the cache first, which we'll share across Apollo tooling.
  // This is an in-memory cache. Since we'll be calling `createClient` on
  // universally, the cache will survive until the HTTP request is
  // responded to (on the server) or for the whole of the user's visit (in
  // the browser)
  const cache = new InMemoryCache();

  // Create a HTTP client (both server/client). It takes the GraphQL
  // server from the `GRAPHQL` environment variable, which by default is
  // set to an external playground at https://graphqlhub.com/graphql
  const httpLink = new HttpLink({
    credentials: "same-origin",
    uri,
  });

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
      }),

        // Split on HTTP and WebSockets
        //split(
          //({ query }) => {
            //const definition = getMainDefinition(query);
            //return (
              //definition.kind === "OperationDefinition" &&
              //definition.operation === "subscription"
            //);
          //},
          // Use WebSockets for subscriptions
          //new WebSocketLink(
            // Replace http(s) with `ws` for connecting via WebSockts
            //new SubscriptionClient(uri.replace(/^https?/, "ws"), {
              //reconnect: true // <-- automatically redirect as needed
            //})
          //),
          // ... fall-back to HTTP for everything else
          httpLink
        //)
      ]),
    });
  }

export const useRemoteSchema = (endpoint: string): string | undefined => {
  const [cachedSchemas, setCachedSchemas] = useState<{[key: string]:string}>({});

  useEffect(() => {
    (async () => {
      if (!endpoint || cachedSchemas[endpoint]) { return; }
      const schema = JSON.parse((await fetchGraphqlSchema(endpoint)));
      setCachedSchemas({...cachedSchemas, [endpoint]: schema.data.__schema});
    })();
  }, [cachedSchemas, endpoint]);

  return endpoint ? cachedSchemas[endpoint] : undefined;
};
