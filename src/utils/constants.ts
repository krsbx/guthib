export const SortBy = {
  JOINED: 'joined',
  FOLLOWERS: 'followers',
  REPOSITORIES: 'repositories',
  BEST_MATCH: 'best_match',
} as const;

export type SortBy = (typeof SortBy)[keyof typeof SortBy];

export const SORT_BY_OPTIONS = [
  { value: SortBy.BEST_MATCH, label: 'Best Match' },
  { value: SortBy.JOINED, label: 'Join Date' },
  { value: SortBy.FOLLOWERS, label: 'Followers' },
  { value: SortBy.REPOSITORIES, label: 'Repositories' },
] as const;

export const OrderBy = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export type OrderBy = (typeof OrderBy)[keyof typeof OrderBy];

export const ORDER_BY_OPTIONS = [
  { value: OrderBy.DESC, label: 'Descending' },
  { value: OrderBy.ASC, label: 'Ascending' },
] as const;

export const RepoType = {
  ALL: 'all',
  OWNER: 'owner',
  MEMBER: 'member',
} as const;

export type RepoType = (typeof RepoType)[keyof typeof RepoType];

export const REPO_TYPE_OPTIONS = [
  { value: RepoType.ALL, label: 'All' },
  { value: RepoType.OWNER, label: 'Owner' },
  { value: RepoType.MEMBER, label: 'Member' },
] as const;
