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
import { useDeletePostMutation } from '../generated/graphql';

interface PostInListProps {
  postId: number;
  title: string;
  text: string;
  points: number;
  voteStatus?: number | null;
  creatorName: string;
}

export const PostInList: React.FC<PostInListProps> = (props) => {
  const { title, text, creatorName, points, postId, voteStatus } = props;
  const [, deletePost] = useDeletePostMutation();

  const handleDeletePost = () => {
    deletePost({ id: postId });
  };

  return (
    <Flex p={5} shadow='md' borderWidth='1px'>
      <UpdootSection voteStatus={voteStatus} points={points} postId={postId} />
      <Box ml={4} w={'100%'}>
        <NextLink href='/post/[id]' as={`/post/${postId}`}>
          <Link display='inline-block'>
            <Heading fontSize='xl'>{title}</Heading>
          </Link>
        </NextLink>
        <Text fontSize='sm'>
          <Text as='span' fontSize='xs'>
            posted by
          </Text>{' '}
          {creatorName}
        </Text>
        <Flex>
          <Text flex={1} mt={4}>
            {formatText(text)}
          </Text>
          <Grid columnGap={3} templateColumns='1fr 1fr'>
            <NextLink href='/post//edit/[id]' as={`/post//edit/${postId}`}>
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
