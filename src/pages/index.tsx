import { Text } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import { NavBar } from '../components/NavBar';
import { usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

const Index = () => {
  const [{ data }] = usePostsQuery();

  return (
    <>
      <NavBar />
      <Text fontSize='lg' fontWeight='bold'>
        Posts:
      </Text>
      {data ? (
        data.posts.map((post) => <div key={post.id}>{post.title}</div>)
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
