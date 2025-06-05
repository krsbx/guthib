import type { User } from '../../src/store/search';

export const userA: User = {
  login: 'octocat',
  id: 1,
  node_id: 'node1',
  avatar_url: '',
  gravatar_id: null,
  url: '',
  html_url: '',
  followers_url: '',
  subscriptions_url: '',
  organizations_url: '',
  repos_url: '',
  received_events_url: '',
  type: 'User',
  score: 1,
  following_url: '',
  gists_url: '',
  starred_url: '',
  events_url: '',
  site_admin: false,
  starred_at: '',
  user_view_type: undefined,
};

export const userB: User = {
  ...userA,
  login: 'hubot',
  id: 2,
  node_id: 'node2',
};

export const sampleUsers: User[] = [userA, userB];
