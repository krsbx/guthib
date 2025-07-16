import { useGlobalStore } from '@/store/globals';
import { useSearchStore } from '@/store/search';
import {
  Button,
  Flex,
  SimpleGrid,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useCallback } from 'react';
import { useShallow } from 'zustand/shallow';
import GithubProfile from '../cards/profile';
import { useGithub } from '@/hooks/useGithub/index';

function SearchContainer() {
  const { isFetching, setInspecting, setIsInspecting } = useGlobalStore(
    useShallow((state) => ({
      isFetching: state.isSearching,
      setInspecting: state.setInspecting,
      setIsInspecting: state.setIsInspecting,
    }))
  );
  const { searchByUsernames } = useGithub();
  const { username, users, filters, setFilter } = useSearchStore(
    useShallow((state) => ({
      username: state.username,
      users: state.users,
      filters: state.filters,
      setFilter: state.setFilter,
    }))
  );

  const onLoadMore = useCallback(async () => {
    if (!username || isFetching) return;

    // Update filters
    setFilter('page', filters.page + 1);

    await searchByUsernames({
      username,
      filters: {
        ...filters,
        page: filters.page + 1,
      },
      append: true,
      managed: true,
    });
  }, [username, isFetching, setFilter, filters, searchByUsernames]);

  const onClick = useCallback(
    (username: string) => () => {
      setInspecting(username);
      setIsInspecting(true);
    },
    [setInspecting, setIsInspecting]
  );

  if (isFetching) {
    return (
      <SimpleGrid minChildWidth={300} gap={3}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Stack
            gap={4}
            direction={'row'}
            key={`skeleton-${i}`}
            alignItems={'center'}
            p={3}
          >
            <SkeletonCircle size="10" />
            <SkeletonText mt="4" noOfLines={2} />
          </Stack>
        ))}
      </SimpleGrid>
    );
  }

  if (!username) return null;

  return (
    <Stack gap={3}>
      <Text>
        Showing {users.length} results for "{username}"
      </Text>
      <SimpleGrid minChildWidth={300} gap={3}>
        {users.map((user) => (
          <Button
            key={user.id}
            w={'full'}
            h={'full'}
            justifyContent={'flex-start'}
            p={3}
            onClick={onClick(user.login)}
          >
            <GithubProfile user={user} />
          </Button>
        ))}
      </SimpleGrid>
      {users.length && (
        <Flex w={'full'} justifyContent={'center'} pt={4}>
          <Button onClick={onLoadMore} size={'sm'}>Load More</Button>
        </Flex>
      )}
    </Stack>
  );
}

export default SearchContainer;
