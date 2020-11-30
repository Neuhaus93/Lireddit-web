import { Text } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import Layout from '../components/Layout';
import { usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

const Index = () => {
  const [{ data }] = usePostsQuery();

  return (
    <Layout>
      <Text fontSize='lg' fontWeight='bold'>
        Posts:
      </Text>
      {data ? (
        data.posts.map((post) => <div key={post.id}>{post.title}</div>)
      ) : (
        <div>Loading...</div>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
