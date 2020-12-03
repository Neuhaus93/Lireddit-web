import { Box, Button, Text } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { InputField, TextareaField } from '../../../components/InputField';
import Layout from '../../../components/Layout';
import { useUpdatePostMutation } from '../../../generated/graphql';
import { useGetPostFromUrl } from '../../../hooks/useGetPostFromUrl';
import { createUrqlClient } from '../../../utils/createUrqlClient';

interface EditPostProps {}

const EditPost: React.FC<EditPostProps> = ({}) => {
  const router = useRouter();
  const [{ data, loading, error }, id] = useGetPostFromUrl();
  const [updatePost] = useUpdatePostMutation();

  if (loading) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }

  if (error || !data?.post) {
    return (
      <Layout>
        <div>Could not find post</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Text fontSize='xl' fontWeight='bold'>
        Update Post
      </Text>
      <Formik
        initialValues={{ title: data.post.title, text: data.post.text }}
        onSubmit={async (values) => {
          const { errors } = await updatePost({ variables: { id, ...values } });
          if (!errors) {
            router.push('/');
          }
        }}>
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name='title'
              placeholder='Edit Post Title'
              label='Edit Title'
            />

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
              Update post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default EditPost;
