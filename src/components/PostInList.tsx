import { Box, Flex, Heading, Link, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import { useMeQuery } from '../generated/graphql';
import { PostsType } from '../pages';
import { EditDeletePostButtons } from './EditDeletePostButtons';
import { UpdootSection } from './UpdootSection';

interface PostInListProps {
  post: PostsType[number];
}

export const PostInList: React.FC<PostInListProps> = ({ post }) => {
  const { id, title, points, voteStatus, textSnippet, creator } = post;
  const [{ data }] = useMeQuery();

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
          <EditDeletePostButtons postId={id} creatorId={creator.id} />
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
