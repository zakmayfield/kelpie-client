import { Link } from '@remix-run/react';

export default function Index() {
  return (
    <div>
      <div>Remix / Apollo (Client, Server) / GraphQL</div>
      
      <div>
        <Link to='pets'>To Pets</Link>
      </div>
      <div>
        <Link to='login'>Login</Link>
      </div>
    </div>
  );
}
