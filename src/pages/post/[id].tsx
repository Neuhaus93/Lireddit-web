import { Text } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import React, { useEffect, useState } from 'react';
import { EditDeletePostButtons } from '../../components/EditDeletePostButtons';
import Layout from '../../components/Layout';
import { PostQuery } from '../../generated/graphql';
import { useGetPostFromUrl } from '../../hooks/useGetPostFromUrl';
import { createUrqlClient } from '../../utils/createUrqlClient';

interface PostProps {}
type PostData = PostQuery['post'];

const Post: React.FC<PostProps> = ({}) => {
  const [[{ data, fetching }]] = useGetPostFromUrl();
  const [post, setPost] = useState(undefined as PostData);

  useEffect(() => {
    if (data && data.post) {
      setPost(data.post);
    }
  }, [data]);

  if (fetching) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div>Could not find post</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Text fontSize='xl' fontWeight='bold'>
        Post
      </Text>
      <Text fontSize='lg'>{post.title}</Text>
      <Text>{post.text}</Text>
      <EditDeletePostButtons postId={post.id} creatorId={post.creator.id} />
    </Layout>
  );
};

const Loading: React.FC<{}> = ({}) => {
  return (
    <div>
      <h3>Loading...</h3>
    </div>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
