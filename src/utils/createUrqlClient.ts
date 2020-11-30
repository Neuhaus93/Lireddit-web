import { devtoolsExchange } from '@urql/devtools';
import { cacheExchange } from '@urql/exchange-graphcache';
import Router from 'next/router';
import { dedupExchange, Exchange, fetchExchange } from 'urql';
import { pipe, tap } from 'wonka';
import {
  CreatePostMutation,
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  PostsDocument,
  PostsQuery,
  RegisterMutation,
} from '../generated/graphql';
import { betterUpdateQuery } from './betterUpdateQuery';

const errorExchange: Exchange = ({ forward }) => (ops$) => {
  return pipe(
    forward(ops$),
    tap(({ error }) => {
      if (error?.message.includes('not authenticated')) {
        Router.replace('/login');
      }
    })
  );
};

export const createUrqlClient = (ssrExchange?: any) => ({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include' as const,
  },
  exchanges: [
    devtoolsExchange,
    dedupExchange,
    cache,
    errorExchange,
    ssrExchange,
    fetchExchange,
  ],
});

const cache = cacheExchange({
  updates: {
    Mutation: {
      // createPost: (_result, _, cache, __) => {
      //   betterUpdateQuery<CreatePostMutation, PostsQuery>(
      //     cache,
      //     { query: PostsDocument},
      //     _result,
      //     (result, query) => {
      //       if (result.createPost) {

      //       }
      //     }
      //   )
      // },

      logout: (_result, _, cache, __) => {
        betterUpdateQuery<LogoutMutation, MeQuery>(
          cache,
          { query: MeDocument },
          _result,
          () => ({ me: null })
        );
      },

      login: (_result, _, cache, __) => {
        betterUpdateQuery<LoginMutation, MeQuery>(
          cache,
          { query: MeDocument },
          _result,
          (result, query) => {
            if (result.login.errors) {
              return query;
            } else {
              return {
                me: result.login.user,
              };
            }
          }
        );
      },

      register: (_result, _, cache, __) => {
        betterUpdateQuery<RegisterMutation, MeQuery>(
          cache,
          { query: MeDocument },
          _result,
          (result, query) => {
            if (result.register.errors) {
              return query;
            } else {
              return {
                me: result.register.user,
              };
            }
          }
        );
      },
    },
  },
});
