import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
    link: new HttpLink({ uri: import.meta.env.VITE_BACKEND_URI || '/api/' }),
    cache: new InMemoryCache(),
});

export default client;