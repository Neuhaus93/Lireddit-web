import { Button, Flex, Stack, Text } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { PostInList } from '../components/PostInList';
import { PostsQuery, usePostsQuery } from '../generated/graphql';
import withApollo from '../utils/withApollo';
import { getDataFromTree } from '@apollo/react-ssr';

type PageState = 'loading' | 'error' | 'success';
export type PostsType = Array<PostsQuery['posts']['edges'][number]>;

export const POSTS_LIMIT = 4;

const Index = () => {
  const [pageState, setPageState] = useState('loading' as PageState);
  const [posts, setPosts] = useState<PostsType>([]);
  const { data, loading, fetchMore, error } = usePostsQuery({
    variables: {
      first: POSTS_LIMIT,
      after: '',
    },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (data && data.posts.edges) {
      const newPosts = data.posts.edges.reduce((prev, edge) => {
        if (edge) {
          const aux = [...prev];
          aux.push(edge);
          return aux;
        } else return prev;
      }, [] as PostsType);

      setPosts(newPosts);
    }
  }, [data]);

  useEffect(() => {
    if (posts.length === 0 && loading) {
      setPageState('loading');
      return;
    }

    if (error) {
      setPageState('error');
      return;
    }

    if (data) {
      setPageState('success');
      return;
    }
  }, [data, loading]);

  const handleLoadMore = useCallback(() => {
    if (!data) {
      return;
    }

    const nodesToDisplay = data.posts.edges.length - 1;
    fetchMore<'first' | 'after'>({
      variables: {
        first: POSTS_LIMIT,
        after: data.posts.edges[nodesToDisplay].createdAt,
      },
    });
  }, [data]);

  return (
    <Layout>
      <Text fontSize='4xl' fontWeight='bold' mb={4}>
        LiReddit
      </Text>
      <Body
        pageState={pageState}
        posts={posts}
        isLoading={loading}
        hasNextPage={!!data?.posts.pageInfo.hasNextPage}
        handleLoadMore={handleLoadMore}
      />
    </Layout>
  );
};

interface BodyProps {
  pageState: PageState;
  isLoading: boolean;
  posts: PostsType;
  hasNextPage: boolean;
  handleLoadMore: () => void;
}

const Body = ({
  pageState,
  posts,
  isLoading,
  hasNextPage,
  handleLoadMore,
}: BodyProps) => {
  switch (pageState) {
    case 'error':
      return <div>Query Failed for some reason</div>;

    case 'loading':
      return <div>Loading...</div>;

    case 'success':
      return (
        <>
          <Stack spacing={8}>
            {posts.map((p) => (!p ? null : <PostInList key={p.id} post={p} />))}
          </Stack>
          {hasNextPage && (
            <Flex>
              <Button
                isLoading={isLoading}
                m='auto'
                my={8}
                onClick={handleLoadMore}>
                Load more
              </Button>
            </Flex>
          )}
        </>
      );
  }
};

// export default withApollo(Index);
export default withApollo(Index, { getDataFromTree });
