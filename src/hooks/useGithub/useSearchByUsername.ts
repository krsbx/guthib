import { useGlobalStore } from '@/store/globals';
import {
  useSearchStore,
  type Users,
  type UseSearchStore,
} from '@/store/search';
import { SortBy } from '@/utils/constants';
import { Github } from '@/utils/github';
import { useCallback } from 'react';
import { useShallow } from 'zustand/shallow';

type UsernameSearchResult = {
  isSuccess: boolean;
  query: string;
  users: Users;
  error: unknown;
  errorMessage: string;
};

type SearchByUsernamesOptions = {
  username: string;
  filters: Partial<UseSearchStore['filters']>;
  append?: boolean;
  managed?: boolean;
};

export function useSearchByUsername() {
  const { setIsFetching, setError, setIsError } = useGlobalStore(
    useShallow((state) => ({
      setIsFetching: state.setIsSearching,
      setIsError: state.setIsError,
      setError: state.setError,
    }))
  );
  const { setUsers, setUsername, addUser } = useSearchStore(
    useShallow((state) => ({
      addUser: state.addUser,
      setUsers: state.setUsers,
      setUsername: state.setUsername,
    }))
  );

  const searchByUsernames = useCallback(
    async (options: SearchByUsernamesOptions) => {
      const {
        username,
        filters = {},
        append = false,
        managed = false,
      } = options;

      if (managed) {
        setIsFetching(true);
      }

      const response = await Github.findUsers(username, {
        order: filters.orderBy,
        page: filters.page,
        per_page: filters.maxPerPage,
        /* v8 ignore start */
        sort: filters.sortBy === SortBy.BEST_MATCH ? undefined : filters.sortBy,
        /* v8 ignore stop */
      });

      const result: UsernameSearchResult = {
        isSuccess: false,
        query: username,
        users: [],
        error: null,
        errorMessage: '',
      };

      if (response.isSuccess) {
        result.isSuccess = true;
        result.users = response.data.items;

        if (managed) {
          setUsername(username);

          if (append) addUser(result.users);
          else setUsers(result.users);
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
    [addUser, setError, setIsError, setIsFetching, setUsername, setUsers]
  );

  return searchByUsernames;
}
