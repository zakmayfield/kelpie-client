import { gql, useQuery } from '@apollo/client';

const LOCATIONS_QUERY = gql`
  query GetPets {
    getPets {
      id
      name
      species
    }
  }
`;

export default function Index() {
  const { data } = useQuery(LOCATIONS_QUERY);
  console.log('::: data from useQuery :::', data);

  return (
    <div>
      Remix / Apollo (Client, Server) / GraphQL
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
