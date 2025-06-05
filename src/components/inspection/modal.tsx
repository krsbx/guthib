import { useGlobalStore } from '@/store/globals';
import { useReposStore } from '@/store/repos';
import { useSearchStore } from '@/store/search';
import { Github } from '@/utils/github';
import { Button, CloseButton, Dialog, Stack } from '@chakra-ui/react';
import { RequestError } from 'octokit';
import { useCallback, useEffect, useMemo } from 'react';
import GithubProfile from '../cards/profile';
import GithubRepo from '../cards/repo';
import GithubRepoSkeleton from '../cards/repo-skeleton';

function InspectionModal() {
  const {
    inspecting,
    isInspecting,
    setIsInspecting,
    setInspecting,
    isFetching,
    setIsFetching,
    setError,
    setIsError,
  } = useGlobalStore();
  const { repos, addRepos } = useReposStore();
  const { users } = useSearchStore();
  const user = useMemo(
    () => users.find((u) => u.login === inspecting),
    [users, inspecting]
  );
  const userRepos = useMemo(() => {
    if (!user) return [];

    return repos[user.login] || [];
  }, [user, repos]);

  const onClose = useCallback(
    (isOpen: boolean) => {
      setIsInspecting(isOpen);

      if (!isOpen) {
        setInspecting('');
      }
    },
    [setIsInspecting, setInspecting]
  );

  const onFetch = useCallback(async () => {
    if (!isInspecting || !user || isFetching || repos[user.login]) return;

    setIsFetching(true);

    const response = await Github.listRepos(user.login);

    if (response.isSuccess) {
      addRepos(user.login, response.data);
    } else {
      setIsError(true);

      if (response.error instanceof RequestError) {
        setError(response.error.message);
      } else if (response.error instanceof Error) {
        setError(response.error.message);
      } else {
        setError('Something went wrong');
      }

      onClose(false);
    }

    setIsFetching(false);
  }, [
    isInspecting,
    user,
    isFetching,
    repos,
    setIsFetching,
    onClose,
    addRepos,
    setIsError,
    setError,
  ]);

  useEffect(() => {
    onFetch();
  }, [onFetch]);

  if (!user) return null;

  return (
    <Dialog.Root
      open={isInspecting}
      onOpenChange={(e) => onClose(e.open)}
      closeOnEscape
      closeOnInteractOutside
      placement={'center'}
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <GithubProfile user={user} />
          </Dialog.Header>
          <Dialog.Body maxH={'40vh'} overflow={'auto'}>
            <Stack gap={4}>
              {isFetching ? (
                <GithubRepoSkeleton />
              ) : (
                userRepos.map((repo) => (
                  <GithubRepo repo={repo} key={repo.id} />
                ))
              )}
            </Stack>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.ActionTrigger asChild>
              <Button>Close</Button>
            </Dialog.ActionTrigger>
          </Dialog.Footer>
          <Dialog.CloseTrigger asChild>
            <CloseButton size="sm" />
          </Dialog.CloseTrigger>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}

export default InspectionModal;
