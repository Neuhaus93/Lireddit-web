import { ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import theme from '../theme';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { PostsConnection } from '../generated/graphql';

// const client = new ApolloClient({
//   uri: process.env.NEXT_PUBLIC_API_URL,
//   credentials: 'include',
//   cache: new InMemoryCache({
//     typePolicies: {
//       Query: {
//         fields: {
//           postsConnection: {
//             keyArgs: [],
//             merge(
//               existing: PostsConnection | undefined,
//               incoming: PostsConnection
//             ): PostsConnection {
//               return {
//                 ...incoming,
//                 edges: [...(existing?.edges || []), ...incoming.edges],
//               };
//             },
//           },
//         },
//       },
//     },
//   }),
// });

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
