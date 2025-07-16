import { useListUserRepos } from './useListUserRepos';
import { useSearchByUsername } from './useSearchByUsername';

export function useGithub() {
  const searchByUsernames = useSearchByUsername();
  const listUserRepos = useListUserRepos();

  return {
    searchByUsernames,
    listUserRepos,
  };
}
