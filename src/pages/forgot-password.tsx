import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';
import { useForgotPasswordMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

export const ForgotPassword: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [complete, setComplete] = useState(false);
  const [forgotPassword] = useForgotPasswordMutation();

  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ email: '' }}
        onSubmit={async (values) => {
          await forgotPassword({ variables: values });
          setComplete(true);
        }}>
        {({ isSubmitting }) =>
          complete ? (
            <Box>We sent you an email, check your mailbox</Box>
          ) : (
            <Form>
              <InputField
                name='email'
                placeholder='Email'
                label='Email'
                type='email'
              />

              <Box mt={4}>
                <Button
                  type='submit'
                  colorScheme='teal'
                  isLoading={isSubmitting}>
                  Submit
                </Button>
              </Box>
            </Form>
          )
        }
      </Formik>
    </Wrapper>
  );
};

export default ForgotPassword;
