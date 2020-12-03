import withApollo from 'next-with-apollo';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  TypePolicies,
} from '@apollo/client';
import { Posts } from '../generated/graphql';

const typePolicies: TypePolicies | undefined = {
  Query: {
    fields: {
      posts: {
        keyArgs: [],
        merge(existing: Posts | undefined, incoming: Posts): Posts {
          return {
            ...incoming,
            edges: [...(existing?.edges || []), ...incoming.edges],
          };
        },
      },
    },
  },
};

export default withApollo(
  ({ initialState, headers }) => {
    return new ApolloClient({
      uri: process.env.NEXT_PUBLIC_API_URL,
      credentials: 'include',
      headers: { cookie: headers?.cookie || '' },
      cache: new InMemoryCache({
        typePolicies,
      }).restore(initialState || {}),
    });
  },
  {
    render: ({ Page, props }) => {
      return (
        <ApolloProvider client={props.apollo}>
          <Page {...props} />
        </ApolloProvider>
      );
    },
  }
);
