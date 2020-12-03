import { getDataFromTree } from '@apollo/react-ssr';
import { Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { EditDeletePostButtons } from '../../components/EditDeletePostButtons';
import Layout from '../../components/Layout';
import { PostQuery } from '../../generated/graphql';
import { useGetPostFromUrl } from '../../hooks/useGetPostFromUrl';
import withApollo from '../../utils/withApollo';

interface PostProps {}
type PostData = PostQuery['post'];

const Post: React.FC<PostProps> = ({}) => {
  const [{ data, loading }] = useGetPostFromUrl();
  const [post, setPost] = useState(undefined as PostData);

  useEffect(() => {
    if (data && data.post) {
      setPost(data.post);
    }
  }, [data]);

  if (loading) {
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

export default withApollo(Post, { getDataFromTree });
