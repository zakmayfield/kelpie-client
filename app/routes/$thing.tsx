import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { db } from '~/utils/db.server';

export const loader = async ({ params }: LoaderArgs) => {
  return json({
    // pet: await db.pet.findUnique({
    //   where: { id: params.petId },
    // }),
    test: 'testing loader'
  });
};

export default function PetRoute() {
  const { test } = useLoaderData<typeof loader>();

  return (
    <div>
      /thing
      <div>
        <h3 >{test}</h3>
      </div>
    </div>
  );
}
