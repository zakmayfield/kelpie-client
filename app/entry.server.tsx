import type { EntryContext } from '@remix-run/node';
import { RemixServer } from '@remix-run/react';
import { renderToString } from 'react-dom/server';
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getDataFromTree } from '@apollo/client/react/ssr';

export default function handleRequest(
  request: Request, // Request type from the Fetch API
  responseStatusCode: number,
  responseHeaders: Headers, // Headers type from the Fetch API
  remixContext: EntryContext
) {
  const headers: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(request.headers)) {
    if (typeof value === 'string') {
      headers[key] = value;
    }
  }
  
  const httpLink = createHttpLink({
    uri: 'https://kelpie-backend.herokuapp.com/',
    headers,
    credentials: request.credentials ?? 'include', // or "same-origin" if your backend server is the same domain
  });

  const authLink = setContext((_, { headers }) => {
    // console.log('headers check | authLink | ::: entry.server', headers)
    return {
      headers: {
        ...headers,
        // // need to figure out what to do here ***
        // authorization: 'Bearer abc123',
      },
    };
  });

  const client = new ApolloClient({
    ssrMode: true,
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
  });

  const App = (
    <ApolloProvider client={client}>
      <RemixServer context={remixContext} url={request.url} />
    </ApolloProvider>
  );

  return getDataFromTree(App).then(() => {
    // Extract the entirety of the Apollo Client cache's current state
    const initialState = client.extract();

    const markup = renderToString(
      <>
        {App}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__APOLLO_STATE__=${JSON.stringify(
              initialState
            ).replace(/</g, '\\u003c')}`, // The replace call escapes the < character to prevent cross-site scripting attacks that are possible via the presence of </script> in a string literal
          }}
        />
      </>
    );

    responseHeaders.set('Content-Type', 'text/html');

    return new Response('<!DOCTYPE html>' + markup, {
      status: responseStatusCode,
      headers: responseHeaders,
    });
  });
}
