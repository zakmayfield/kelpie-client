import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

function Client() {
  const client = new ApolloClient({
    cache: new InMemoryCache().restore(window.__APOLLO_STATE__),
    uri: "http://localhost:4000/graphql"
  });

  return (
    <ApolloProvider client={client}>
      <RemixBrowser />
    </ApolloProvider>
  )
}

function hydrate() {
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <Client />
      </StrictMode>
    );
  });
}

if (typeof requestIdleCallback === "function") {
  requestIdleCallback(hydrate);
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  setTimeout(hydrate, 1);
}
