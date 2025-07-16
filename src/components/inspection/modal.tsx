import { useGlobalStore } from '@/store/globals';
import { useReposStore } from '@/store/repos';
import { useSearchStore } from '@/store/search';
import { Button, CloseButton, Dialog, Flex, Stack } from '@chakra-ui/react';
import React, { useCallback, useEffect, useMemo } from 'react';
import GithubProfile from '../cards/profile';
import GithubRepo from '../cards/repo';
import GithubRepoSkeleton from '../cards/repo-skeleton';
import { useGithub } from '@/hooks/useGithub/index';
import { useShallow } from 'zustand/shallow';

function InspectionModal() {
  const {
    inspecting,
    isInspecting,
    setIsInspecting,
    setInspecting,
    isFetching,
  } = useGlobalStore(
    useShallow((state) => ({
      inspecting: state.inspecting,
      isInspecting: state.isInspecting,
      setIsInspecting: state.setIsInspecting,
      setInspecting: state.setInspecting,
      isFetching: state.isFetching,
    }))
  );
  const { listUserRepos } = useGithub();
  const { repos, filters, setFilter } = useReposStore(
    useShallow((state) => ({
      repos: state.repos,
      filters: state.filters,
      setFilter: state.setFilter,
    }))
  );
  const { users } = useSearchStore(
    useShallow((state) => ({ users: state.users }))
  );
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
      setFilter('page', 1);
      setIsInspecting(isOpen);

      if (!isOpen) {
        setInspecting('');
      }
    },
    [setFilter, setIsInspecting, setInspecting]
  );

  const onLoadMore = useCallback(async () => {
    if (!isInspecting || !user || isFetching || !repos[user.login]) return;

    // Update filters
    setFilter('page', filters.page + 1);

    await listUserRepos({
      username: user.login,
      filters: {
        ...filters,
        page: 1,
      },
      managed: true,
    });
  }, [
    filters,
    isFetching,
    isInspecting,
    listUserRepos,
    repos,
    setFilter,
    user,
  ]);

  const onFetch = useCallback(async () => {
    /* v8 ignore start */
    if (!isInspecting || !user || isFetching || repos[user.login]) return;
    /* v8 ignore stop */

    // Set the page to 1
    setFilter('page', 1);

    const response = await listUserRepos({
      username: user.login,
      filters: {
        ...filters,
        page: 1,
      },
      managed: true,
    });

    if (!response.isSuccess) {
      onClose(false);
    }
  }, [
    isInspecting,
    user,
    isFetching,
    repos,
    setFilter,
    listUserRepos,
    filters,
    onClose,
  ]);

  useEffect(() => {
    void onFetch();
  }, [onFetch]);

  if (!user) return null;

  return (
    <Dialog.Root
      open={isInspecting}
      /* v8 ignore start */
      onOpenChange={(e) => onClose(e.open)}
      /* v8 ignore stop */
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
                <React.Fragment>
                  {userRepos.map((repo) => (
                    <GithubRepo repo={repo} key={repo.id} />
                  ))}
                  {userRepos.length && (
                    <Flex w={'full'} justifyContent={'center'} pt={2}>
                      <Button onClick={onLoadMore} size={'xs'}>
                        Load More
                      </Button>
                    </Flex>
                  )}
                </React.Fragment>
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
