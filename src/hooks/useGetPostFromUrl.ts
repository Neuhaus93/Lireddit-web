import { useRouter } from 'next/router';
import { UseQueryResponse } from 'urql/dist/types/hooks';
import { PostQuery, usePostQuery } from '../generated/graphql';
import { getIntId } from '../utils/getIntId';

export const useGetPostFromUrl = () => {
  const router = useRouter();
  const { id: queriedId } = router.query;
  const id = getIntId(queriedId);
  const queryResult = usePostQuery({
    pause: id === -1,
    variables: { id },
  });
  return [queryResult, id] as [UseQueryResponse<PostQuery, object>, number];
};
