import { Box, Button, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import {
  PostsConnectionQuery,
  usePostsConnectionQuery,
} from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

type PageState = 'loading' | 'error' | 'success';
type PostsType = Array<
  PostsConnectionQuery['postsConnection']['edges'][number]['node']
>;

const POSTS_LIMIT = 5;

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
      const posts = data.postsConnection.edges.map((edge) => {
        return edge.node;
      });

      setPosts(posts);
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
            {posts.map((p) => (
              <EachPost
                key={p.id}
                title={p.title}
                text={p.textSnippet}
                creatorName={p.creator.username}
              />
            ))}
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

interface EachPostProps {
  title: string;
  text: string;
  creatorName: string;
}

const EachPost = (props: EachPostProps) => {
  const { title, text, creatorName } = props;
  const shownText =
    text.length === 50
      ? text[49] === ' '
        ? text.slice(0, 49) + '...'
        : `${text}...`
      : text;

  return (
    <Box p={5} shadow='md' borderWidth='1px'>
      <Heading fontSize='xl'>{title}</Heading>{' '}
      <Text>posted by {creatorName}</Text>
      <Text mt={4}>{shownText}</Text>
    </Box>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
