import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { PostQuery, usePostQuery } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { Text } from '@chakra-ui/react';

interface PostProps {}
type PostData = PostQuery['post'];

/**
 * @param queriedId ID got from the url
 * @returns The parsed int ID, or -1 if unsuccessful
 */
function getIntId(queriedId: string | string[] | undefined) {
  let intId = typeof queriedId === 'string' ? parseInt(queriedId) : -1;
  if (isNaN(intId)) {
    return -1;
  } else {
    return intId;
  }
}

const Post: React.FC<PostProps> = ({}) => {
  const router = useRouter();
  const { id: queriedId } = router.query;
  const id = getIntId(queriedId);
  const [{ data, fetching }] = usePostQuery({
    pause: id === -1,
    variables: { id },
  });
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
      <div>
        <Text fontSize='xl' fontWeight='bold'>
          Post
        </Text>
        <Text fontSize='lg'>{post.title}</Text>
        <Text>{post.text}</Text>
      </div>
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
