import { useLoaderData } from '@remix-run/react';
import { gql } from 'graphql-tag';
import { fetchGql } from '~/lib/fetch-gql.server';

export async function loader({ request }: any) {
  const query = gql`
    query GetPets {
      getPets {
        id
        name
        species
      }
    }
  `;

  return fetchGql({
    operationName: 'GetPets',
    query,
    variables: {},
    request,
  });
}

export default function PetsRoute() {
  const { data, error } = useLoaderData<typeof loader>();

  if (error) {
    console.log('error', error);
  }

  return (
    <div>
      <div>Pets Route</div>

      <div>
        {data &&
          data.getPets &&
          data.getPets.map((pet: any) => (
            <div key={pet.id}>
              <h2>{pet.name}</h2>
              <h4>{pet.species}</h4>
            </div>
          ))}
      </div>
    </div>
  );
}
