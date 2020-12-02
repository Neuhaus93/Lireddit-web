import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Box, Grid, IconButton, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import { useDeletePostMutation, useMeQuery } from '../generated/graphql';

interface EditDeletePostButtonsProps {
  postId: number;
  creatorId: number;
}

export const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({
  postId,
  creatorId,
}) => {
  const [, deletePost] = useDeletePostMutation();
  const [{ data }] = useMeQuery();

  if (data?.me?.id !== creatorId) {
    return null;
  }

  return (
    <Box>
      <NextLink href='/post/edit/[id]' as={`/post/edit/${postId}`}>
        <IconButton as={Link} aria-label='Edit post' icon={<EditIcon />} />
      </NextLink>
      <IconButton
        aria-label='Delete post'
        icon={<DeleteIcon />}
        ml={4}
        onClick={() => {
          deletePost({ id: postId });
        }}
      />
    </Box>
  );
};
