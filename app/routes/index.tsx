import { gql, useQuery } from '@apollo/client';
import { redirect } from '@remix-run/node';


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
  const { data, loading, error } = useQuery(LOCATIONS_QUERY);
  console.log('::: data from useQuery :::', data);

  if (loading) {
    console.log('error', error)
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <p>Loading...</p>
      </div>
    )
  }

  if (error) {
    console.log('error', error)
    return redirect('/test')
  }

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
