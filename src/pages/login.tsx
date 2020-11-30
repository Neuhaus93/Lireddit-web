import { Box, Button, Link } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';
import { useLoginMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { toErrorMap } from '../utils/toErrorMap';
import NextLink from 'next/link';

const Login: React.FC<{}> = ({}) => {
  const [, login] = useLoginMutation();
  const router = useRouter();

  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login({ values });

          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            if (typeof router.query.next === 'string') {
              router.push(router.query.next);
            } else {
              router.push('/');
            }
          }
        }}>
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name='email'
              placeholder='Email'
              label='Email'
              type='email'
            />

            <Box mt={4}>
              <InputField
                name='password'
                placeholder='Password'
                label='Password'
                type='password'
              />
            </Box>

            <Box textAlign='right' mt={2}>
              <NextLink href='/forgot-password'>
                <Link>Forgot password?</Link>
              </NextLink>
            </Box>

            <Box mt={4}>
              <Button type='submit' colorScheme='teal' isLoading={isSubmitting}>
                Login
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
