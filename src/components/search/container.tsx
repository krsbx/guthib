import { useGlobalStore } from '@/store/globals';
import { useSearchStore } from '@/store/search';
import {
  Avatar,
  Button,
  SimpleGrid,
  Stack,
  Text,
  SkeletonCircle,
  SkeletonText,
} from '@chakra-ui/react';
import { useShallow } from 'zustand/shallow';

function SearchContainer() {
  const { isFetching } = useGlobalStore(
    useShallow((state) => ({ isFetching: state.isSearching }))
  );
  const { username, users } = useSearchStore(
    useShallow((state) => ({
      username: state.username,
      users: state.users,
    }))
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
          >
            <Stack gap={4} direction={'row'}>
              <Avatar.Root>
                <Avatar.Fallback name={user.name || user.login} />
                <Avatar.Image src={user.avatar_url} />
              </Avatar.Root>
              <Stack gap={2} flex={1} justifyContent={'center'}>
                {user.name && <Text fontSize={'sm'}>{user.name}</Text>}
                <Text fontWeight={'bold'} fontSize={'md'}>
                  {user.login}
                </Text>
                {user.followers && (
                  <Text fontSize={'sm'}>{user.followers}</Text>
                )}
                {user.following && (
                  <Text fontSize={'sm'}>{user.following}</Text>
                )}
              </Stack>
            </Stack>
          </Button>
        ))}
      </SimpleGrid>
    </Stack>
  );
}

export default SearchContainer;
