import { Cache, cacheExchange, Data } from '@urql/exchange-graphcache';
import { relayPagination } from '@urql/exchange-graphcache/extras';
import gql from 'graphql-tag';
import { PartialNextContext, SSRExchange } from 'next-urql';
import Router from 'next/router';
import { ClientOptions, dedupExchange, Exchange, fetchExchange } from 'urql';
import { pipe, tap } from 'wonka';
import {
  DeletePostMutationVariables,
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  Mutation,
  RegisterMutation,
  VoteMutationVariables,
} from '../generated/graphql';
import { betterUpdateQuery } from './betterUpdateQuery';
import { isServer } from './isServer';

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

const invalidateAllPosts = (cache: Cache) => {
  const allFields = cache.inspectFields('Query');
  const fieldInfos = allFields.filter(
    (info) => info.fieldName === 'postsConnection'
  );
  fieldInfos.forEach((fi) => {
    cache.invalidate('Query', 'postsConnection', fi.arguments || {});
  });
};

export const createUrqlClient = (
  ssrExchange: SSRExchange,
  ctx?: PartialNextContext
): ClientOptions => {
  let cookie = '';

  if (isServer()) {
    if (ctx) {
      cookie = ctx?.req?.headers?.cookie;
    }
  }

  return {
    url: 'http://localhost:4000/graphql',
    fetchOptions: {
      credentials: 'include' as const,
      headers: cookie
        ? {
            cookie,
          }
        : undefined,
    },
    exchanges: [
      dedupExchange,
      cache,
      errorExchange,
      ssrExchange,
      fetchExchange,
    ],
  };
};

const cache = cacheExchange({
  resolvers: {
    Query: {
      postsConnection: relayPagination(),
    },
  },
  updates: {
    Mutation: {
      deletePost: (_result, args, cache, info) => {
        const { id } = args as DeletePostMutationVariables;
        const { deletePost: successfullyDeleted } = _result as Data &
          Pick<Mutation, 'deletePost'>;

        if (!successfullyDeleted) {
          return;
        }

        cache.invalidate({ __typename: 'Post', id });
      },

      vote: (_result, args, cache, info) => {
        const { postId } = args as VoteMutationVariables;
        const {
          vote: { voteWasRegistered, ammountChanged, newVoteStatus },
        } = _result as Data & Pick<Mutation, 'vote'>;

        if (!voteWasRegistered) {
          return;
        }

        const data = cache.readFragment(
          gql`
            fragment _ on Post {
              id
              points
              voteStatus
            }
          `,
          { id: postId, points: 0, voteStatus: null }
        );

        if (data) {
          const newPoints = data.points + ammountChanged;

          cache.writeFragment(
            gql`
              fragment __ on Post {
                id
                points
                voteStatus
              }
            `,
            { id: postId, points: newPoints, voteStatus: newVoteStatus }
          );
        }
      },

      createPost: (_result, args, cache, info) => {
        invalidateAllPosts(cache);
      },

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
        invalidateAllPosts(cache);
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
