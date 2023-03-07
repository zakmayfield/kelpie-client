import { print } from 'graphql';

export async function fetchGql({
  operationName,
  query,
  variables,
  request,
}: any) {
  const headers = new Headers();
  headers.set('content-type', 'application/json');
  // headers.set('authorization', `no token`);

  const config: RequestInit = {
    headers,
    method: 'POST',
    body: JSON.stringify({
      operationName,
      query: print(query),
      variables,
    }),
  };

  // GRAPHQL_URL is either pointing to development server OR production server. Default is development.
  const url = process.env.GRAPHQL_URL ?? '';

  const res = await fetch(url, config);
  const data = await res.json();

  // network errors can go to a catch boundary
  if (!res.ok) {
    throw new Response(res.statusText, { status: res.status || 500 });
  }

  return data;
}
