import type { Repo } from '@/store/repos';
import { Icon, Stack, Text } from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';

function GithubRepo({ repo }: { repo: Repo }) {
  return (
    <Stack gap={1}>
      <Stack
        direction={'row'}
        justifyContent={'space-between'}
        fontWeight={'bold'}
      >
        <Text w={'full'}>{repo.name}</Text>
        {typeof repo.stargazers_count !== 'undefined' && (
          <Stack direction="row" gap={0.5}>
            <Text>{repo.stargazers_count}</Text>
            <Icon size={'sm'}>
              <FaStar />
            </Icon>
          </Stack>
        )}
      </Stack>
      {repo.description && (
        <Text fontSize={'sm'} w={'80%'}>
          {repo.description}
        </Text>
      )}
    </Stack>
  );
}

export default GithubRepo;
