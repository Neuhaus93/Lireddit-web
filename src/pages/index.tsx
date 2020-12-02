import { Button, Flex, Stack, Text } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { PostInList } from '../components/PostInList';
import {
  PostsConnectionQuery,
  usePostsConnectionQuery,
} from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

type PageState = 'loading' | 'error' | 'success';
export type PostsType = Array<
  PostsConnectionQuery['postsConnection']['edges'][number]['node']
>;

const POSTS_LIMIT = 15;

const Index = () => {
  const [variables, setVariables] = useState({
    first: POSTS_LIMIT,
    after: '',
  });
  const [{ data, fetching }] = usePostsConnectionQuery({
    variables,
  });
  const [pageState, setPageState] = useState('loading' as PageState);
  const [posts, setPosts] = useState([] as PostsType);

  useEffect(() => {
    if (data && data.postsConnection.edges) {
      const newPosts = data.postsConnection.edges.reduce((prev, edge) => {
        if (edge) {
          const aux = [...prev];
          aux.push(edge.node);
          return aux;
        } else return prev;
      }, [] as PostsType);

      setPosts(newPosts);
    }
  }, [data]);

  useEffect(() => {
    if (posts.length === 0 && fetching) {
      setPageState('loading');
      return;
    }

    if (!fetching && !data) {
      setPageState('error');
      return;
    }

    if (data) {
      setPageState('success');
      return;
    }
  }, [data, fetching]);

  return (
    <Layout>
      <Text fontSize='4xl' fontWeight='bold' mb={4}>
        LiReddit
      </Text>
      <Body
        pageState={pageState}
        posts={posts}
        fetching={fetching}
        setVariables={setVariables}
        hasNextPage={!!data?.postsConnection.pageInfo.hasNextPage}
      />
    </Layout>
  );
};

interface BodyProps {
  pageState: PageState;
  fetching: boolean;
  posts: PostsType;
  hasNextPage: boolean;
  setVariables: React.Dispatch<
    React.SetStateAction<{
      first: number;
      after: string;
    }>
  >;
}

const Body = ({
  pageState,
  posts,
  fetching,
  setVariables,
  hasNextPage,
}: BodyProps) => {
  const handleLoadMore = () => {
    if (posts) {
      setVariables({
        first: POSTS_LIMIT,
        after: posts[posts.length - 1].createdAt,
      });
    }
  };

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
                isLoading={fetching}
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

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
