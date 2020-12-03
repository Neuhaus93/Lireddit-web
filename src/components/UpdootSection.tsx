import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Flex, IconButton } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useVoteMutation } from '../generated/graphql';

interface UpdootSectionProps {
  postId: number;
  points: number;
  voteStatus?: number | null;
}
type LoadingState = 'updoot-loading' | 'downdoot-loading' | 'not-loading';

export const UpdootSection: React.FC<UpdootSectionProps> = ({
  points,
  postId,
  voteStatus,
}) => {
  const [loadingState, setLoadingState] = useState<LoadingState>('not-loading');
  const [vote] = useVoteMutation();

  return (
    <Flex direction='column' justifyContent='center' alignItems='center'>
      <IconButton
        aria-label='Up vote post'
        isRound
        colorScheme={voteStatus === 1 ? 'green' : undefined}
        onClick={async () => {
          setLoadingState('updoot-loading');
          try {
            await vote({
              variables: {
                postId,
                value: 1,
              },
            });
          } catch {
          } finally {
            setLoadingState('not-loading');
          }
        }}
        disabled={loadingState === 'updoot-loading'}
        icon={<ChevronUpIcon w={6} h={6} />}
      />
      {points}
      <IconButton
        isRound
        aria-label='Down vote post'
        colorScheme={voteStatus === -1 ? 'red' : undefined}
        onClick={async () => {
          setLoadingState('downdoot-loading');
          try {
            await vote({
              variables: {
                postId,
                value: -1,
              },
            });
          } catch {
          } finally {
            setLoadingState('not-loading');
          }
        }}
        disabled={loadingState === 'downdoot-loading'}
        icon={<ChevronDownIcon w={6} h={6} />}
      />
    </Flex>
  );
};
