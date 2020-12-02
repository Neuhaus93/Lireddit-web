import {
  Box,
  Flex,
  Grid,
  Heading,
  IconButton,
  Link,
  Text,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import { UpdootSection } from './UpdootSection';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { useDeletePostMutation, useMeQuery } from '../generated/graphql';
import { PostsType } from '../pages';

interface PostInListProps {
  post: PostsType[number];
}

export const PostInList: React.FC<PostInListProps> = ({ post }) => {
  const { id, title, points, voteStatus, textSnippet, creator } = post;
  const [{ data }] = useMeQuery();
  const [, deletePost] = useDeletePostMutation();

  const handleDeletePost = () => {
    deletePost({ id });
  };

  return (
    <Flex p={5} shadow='md' borderWidth='1px'>
      <UpdootSection voteStatus={voteStatus} points={points} postId={id} />
      <Box ml={4} w={'100%'}>
        <NextLink href='/post/[id]' as={`/post/${id}`}>
          <Link display='inline-block'>
            <Heading fontSize='xl'>{title}</Heading>
          </Link>
        </NextLink>
        <Text fontSize='sm'>
          <Text as='span' fontSize='xs'>
            posted by
          </Text>{' '}
          {creator.username}
        </Text>
        <Flex>
          <Text flex={1} mt={4}>
            {formatText(textSnippet)}
          </Text>
          {data?.me?.id !== post.creator.id ? null : (
            <Grid columnGap={3} templateColumns='1fr 1fr'>
              <NextLink href='/post/edit/[id]' as={`/post/edit/${id}`}>
                <IconButton
                  as={Link}
                  aria-label='Edit post'
                  icon={<EditIcon />}
                />
              </NextLink>
              <IconButton
                aria-label='Delete post'
                icon={<DeleteIcon />}
                onClick={handleDeletePost}
              />
            </Grid>
          )}
        </Flex>
      </Box>
    </Flex>
  );
};

function formatText(text: string) {
  return text.length === 50
    ? text[49] === ' '
      ? text.slice(0, 49) + '...'
      : `${text}...`
    : text;
}
