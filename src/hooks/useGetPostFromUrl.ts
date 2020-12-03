import { QueryResult } from '@apollo/client';
import { useRouter } from 'next/router';
import { Exact, PostQuery, usePostQuery } from '../generated/graphql';
import { getIntId } from '../utils/getIntId';

export const useGetPostFromUrl = () => {
  const router = useRouter();
  const { id: queriedId } = router.query;
  const id = getIntId(queriedId);
  const queryResult = usePostQuery({
    skip: id === -1,
    variables: { id },
  });
  return [queryResult, id] as [
    QueryResult<PostQuery, Exact<{ id: number }>>,
    number
  ];
};
