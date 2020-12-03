import React from 'react';
import { Box, Button, Flex, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';
import { useRouter } from 'next/router';
import { useApolloClient } from '@apollo/client';

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [logout, { loading: logoutLoading }] = useLogoutMutation();
  const apolloClient = useApolloClient();
  const { data, loading } = useMeQuery({
    skip: isServer(),
  });

  let body = null;

  // Data is loading
  if (loading || !data) {
    // User not logged in
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href='/login'>
          <Link mr={2}>login</Link>
        </NextLink>
        <NextLink href='/register'>
          <Link>register</Link>
        </NextLink>
      </>
    );

    // User logged in
  } else {
    body = (
      <Flex>
        <Box mr={2}>{data.me.username}</Box>
        <Button
          onClick={async () => {
            await logout();
            await apolloClient.resetStore();
          }}
          isLoading={logoutLoading}
          variant='link'>
          Logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex bg='tan' p={4} ml={'auto'}>
      <NextLink href='/'>
        <Link>Home</Link>
      </NextLink>
      <Box ml={2}>
        <NextLink href='/create-post'>
          <Link>Create Post</Link>
        </NextLink>
      </Box>
      <Box ml={'auto'}>{body}</Box>
    </Flex>
  );
};
