export interface ListOptions {
  order: 'asc' | 'desc';
  page: number;
  per_page: number;
}

export interface SearchUsernameOptions extends ListOptions {
  sort: 'repositories' | 'followers' | 'joined';
}

export interface ListUserReposOptions extends ListOptions {
  sort: 'created' | 'updated' | 'pushed' | 'full_name';
  type: 'all' | 'owner' | 'member';
}
