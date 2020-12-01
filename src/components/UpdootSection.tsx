import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Flex, IconButton } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useVoteMutation } from '../generated/graphql';

interface UpdootSectionProps {
  postId: number;
  points: number;
}
type LoadingState = 'updoot-loading' | 'downdoot-loading' | 'not-loading';

export const UpdootSection: React.FC<UpdootSectionProps> = ({
  points,
  postId,
}) => {
  const [loadingState, setLoadingState] = useState<LoadingState>('not-loading');
  const [, vote] = useVoteMutation();

  return (
    <Flex direction='column' justifyContent='center' alignItems='center'>
      <IconButton
        variant='ghost'
        aria-label='Up vote post'
        onClick={async () => {
          setLoadingState('updoot-loading');
          try {
            await vote({
              postId,
              value: 1,
            });
          } catch {
          } finally {
            setLoadingState('not-loading');
          }
        }}
        disabled={loadingState === 'updoot-loading'}
        icon={<ChevronUpIcon w={8} h={8} />}
      />
      {points}
      <IconButton
        variant='ghost'
        aria-label='Down vote post'
        onClick={async () => {
          setLoadingState('downdoot-loading');
          try {
            await vote({
              postId,
              value: -1,
            });
          } catch {
          } finally {
            setLoadingState('not-loading');
          }
        }}
        disabled={loadingState === 'downdoot-loading'}
        icon={<ChevronDownIcon w={8} h={8} />}
      />
    </Flex>
  );
};
