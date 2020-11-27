import React from 'react';
import { Form, Formik } from 'formik';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { Box, Button } from '@chakra-ui/react';
import { useMutation } from 'urql';

interface registerProps {}

const REGISTER_MUTATION = `
  mutation register($username: String!, $password: String!) {
    register(values: { username: $username, password: $password }) {
      errors {
        field
        message
      }
      user {
        id
        username
        createdAt
        updatedAt
      }
    }
  }
`;

const Register: React.FC<registerProps> = ({}) => {
  const [, register] = useMutation(REGISTER_MUTATION);

  const handleSubmit = (values: { username: string; password: string }) => {
    console.log(values);
    return register(values);
  };

  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name='username'
              placeholder='Username'
              label='Username'
            />

            <Box mt={4}>
              <InputField
                name='password'
                placeholder='Password'
                label='Password'
                type='password'
              />
            </Box>

            <Box mt={6}>
              <Button type='submit' colorScheme='teal' isLoading={isSubmitting}>
                Register
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
