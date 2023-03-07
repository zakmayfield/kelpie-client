import type { ActionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, useActionData, useSearchParams } from '@remix-run/react';
import gql from 'graphql-tag';
import { fetchGql } from '~/lib/fetch-gql.server';
import { badRequest } from '~/utils/request.server';

export const loader = async () => {
  return json({ status: 'logged_out' });
};

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const email = form.get('email');
  const password = form.get('password');

  if (typeof email !== 'string' || typeof password !== 'string') {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: `Form not submitted correctly.`,
    });
  }

  const fields = { email, password };

  const fieldErrors = {
    email: '',
    password: '',
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fields,
      fieldErrors,
      formError: null,
    });
  }

  const query = gql`
    mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        user {
          id
          name
          email
          type
          username
        }
        token
      }
    }
  `;

  const data = await fetchGql({
    operationName: 'Login',
    query,
    variables: fields,
    request,
  });

  // this is the response data from our login mutation, accurately coming through.
  console.log('data from login.tsx | action :::', data.data.login.user);

  // const session = await getSession();
  // session.set('userId', data.data.login.user.id);
  // return redirect('/pets', {
  //   headers: {
  //     'Set-Cookie': await commitSession(session),
  //   },
  // });

  return data;
};

export default function Login() {
  const actionData = useActionData<typeof action>();
  const [searchParams] = useSearchParams();

  return (
    <Form method='post'>
      <input
        type='hidden'
        name='redirectTo'
        value={searchParams.get('redirectTo') ?? undefined}
      />

      <input
        type='text'
        id='email'
        name='email'
        placeholder='email'
        defaultValue={actionData?.fields?.email}
        aria-invalid={Boolean(actionData?.fieldErrors?.email || undefined)}
        aria-errormessage={
          actionData?.fieldErrors?.email ? 'email-error' : undefined
        }
      />

      <input
        type='text'
        id='password'
        name='password'
        placeholder='password'
        defaultValue={actionData?.fields?.password}
        aria-invalid={Boolean(actionData?.fieldErrors?.password)}
        aria-errormessage={
          actionData?.fieldErrors?.password ? 'password-error' : undefined
        }
      />
      <button>Log In</button>
    </Form>
  );
}
