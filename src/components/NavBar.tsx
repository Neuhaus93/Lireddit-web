import React from 'react';
import { Box, Button, Flex, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useMeQuery } from '../generated/graphql';

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ data, fetching }] = useMeQuery();
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
        <Box>{data.me.username}</Box>
        <Button variant='link'>Logout</Button>
      </Flex>
    );
  }

  return (
    <Flex bg='tomato' p={4} ml={'auto'}>
      <Box ml={'auto'}>{body}</Box>
    </Flex>
  );
};

export default NavBar;
