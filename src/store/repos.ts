import type { Github } from '@/utils/github';
import { create } from 'zustand';

export type Repos = Required<
  Awaited<ReturnType<(typeof Github)['listRepos']>>
>['data'];

export type Repo = Repos[number];

export interface UseReposStore {
  repos: Record<string, Repos>;
  setRepos: (repos: Record<string, Repos>) => void;

  addRepos: (username: string, repos: Repos | Repo) => void;
  removeRepos: (username: string) => void;
}

export const useReposStore = create<UseReposStore>((set) => ({
  repos: {},
  setRepos: (repos) => {
    set({ repos });
  },
  addRepos: (username, repos) => {
    set((prev) => {
      const prevRepos = prev.repos[username] || [];
      const newRepos = Array.isArray(repos) ? repos : [repos];

      return {
        ...prev,
        repos: {
          ...prev.repos,
          [username]: [...prevRepos, ...newRepos],
        },
      };
    });
  },
  removeRepos: (username) => {
    set((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [username]: _, ...repos } = prev.repos;

      return {
        ...prev,
        repos: repos,
      };
    });
  },
}));
