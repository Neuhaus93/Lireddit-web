import React from 'react';
import { Box, Button, Flex, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ data, fetching }] = useMeQuery();
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  let body = null;

  // Data is loading
  if (fetching) {
    body = null;

    // User not logged in
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href='/login'>
          <Link mr={2} fontWeight='bold'>
            login
          </Link>
        </NextLink>
        <NextLink href='/register'>
          <Link fontWeight='bold'>register</Link>
        </NextLink>
      </>
    );

    // User logged in
  } else {
    body = (
      <Flex>
        <Box mr={2}>{data.me.username}</Box>
        <Button
          variant='link'
          isLoading={logoutFetching}
          onClick={() => {
            logout();
          }}>
          Logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex bg='tan' p={4} ml={'auto'}>
      <Box ml={'auto'}>{body}</Box>
    </Flex>
  );
};

export default NavBar;
