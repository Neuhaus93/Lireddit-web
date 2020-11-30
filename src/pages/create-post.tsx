import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import React from 'react';
import { InputField, TextareaField } from '../components/InputField';
import Layout from '../components/Layout';
import { useCreatePostMutation } from '../generated/graphql';
import { useIsAuth } from '../hooks/useIsAuth';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useRouter } from 'next/router';

const initialValues = {
  title: '',
  text: '',
};

const CreatePost: React.FC<{}> = ({}) => {
  useIsAuth();
  const [, createPost] = useCreatePostMutation();
  const router = useRouter();

  return (
    <Layout>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values) => {
          const { error } = await createPost({ input: values });
          if (!error) {
            router.push('/');
          }
        }}>
        {({ isSubmitting }) => (
          <Form>
            <InputField name='title' placeholder='Post Title' label='Title' />

            <Box mt={4}>
              <TextareaField
                name='text'
                placeholder='Post Text...'
                rows={6}
                label='Body'
              />
            </Box>

            <Button
              mt={4}
              type='submit'
              colorScheme='teal'
              isLoading={isSubmitting}>
              Create Post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(CreatePost);
