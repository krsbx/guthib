import { useGlobalStore } from '@/store/globals';
import { useReposStore, type Repos, type UseReposStore } from '@/store/repos';
import { Github } from '@/utils/github';
import { useCallback } from 'react';
import { useShallow } from 'zustand/shallow';

type UserRepoSearchResult = {
  isSuccess: boolean;
  query: string;
  repos: Repos;
  error: unknown;
  errorMessage: string;
};

type ListUserReposOptions = {
  username: string;
  filters?: Partial<UseReposStore['filters']>;
  managed?: boolean;
};

export function useListUserRepos() {
  const { setIsFetching, setError, setIsError } = useGlobalStore(
    useShallow((state) => ({
      setIsFetching: state.setIsFetching,
      setIsError: state.setIsError,
      setError: state.setError,
    }))
  );
  const { addRepos } = useReposStore(
    useShallow((state) => ({
      addRepos: state.addRepos,
    }))
  );

  const listUserRepos = useCallback(
    async (options: ListUserReposOptions) => {
      const { username, filters = {}, managed = false } = options;

      if (managed) {
        setIsFetching(true);
      }

      const response = await Github.listRepos(username, {
        sort: 'pushed',
        type: filters?.type ?? 'all',
        page: filters.page,
        per_page: filters.maxPerPage,
      });

      const result: UserRepoSearchResult = {
        isSuccess: false,
        query: username,
        repos: [],
        error: null,
        errorMessage: '',
      };

      if (response.isSuccess) {
        result.isSuccess = true;
        result.repos = response.data;

        if (managed) {
          addRepos(username, result.repos);
        }
      } else {
        result.isSuccess = false;
        result.error = response.error;
        result.errorMessage = Github.getErrorMessage(response.error);

        if (managed) {
          setError(result.errorMessage);
          setIsError(true);
        }
      }

      if (managed) {
        setIsFetching(false);
      }

      return result;
    },
    [addRepos, setError, setIsError, setIsFetching]
  );

  return listUserRepos;
}
