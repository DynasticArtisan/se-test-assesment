import { createRoot } from 'react-dom/client';
import { ApolloProvider } from "@apollo/client/react";
import apolloClient from './apolloClient';
import UserList from './users/UserList';


createRoot(document.getElementById('root')!).render(
  <ApolloProvider client={apolloClient}>
      <UserList />
  </ApolloProvider>,
)
