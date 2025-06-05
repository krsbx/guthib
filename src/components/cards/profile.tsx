import type { Users } from '@/store/search';
import { Avatar, Stack, Text } from '@chakra-ui/react';

function GithubProfile({ user }: { user: Users[number] }) {
  return (
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
        {user.followers && <Text fontSize={'sm'}>{user.followers}</Text>}
        {user.following && <Text fontSize={'sm'}>{user.following}</Text>}
      </Stack>
    </Stack>
  );
}

export default GithubProfile;
