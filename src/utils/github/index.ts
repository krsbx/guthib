import { Octokit } from 'octokit';
import { requestWrapper } from '../request';
import type { ListUserReposOptions, SearchUsernameOptions } from './types';

// Only use `import.meta.env.VITE_GITHUB_TOKEN` if we're in development
// Change this to true if you want to use it in production or just change the `import.meta.env.DEV` to `import.meta.env.PROD`
const conditionalToken = import.meta.env.DEV;

export class Github {
  private _octokit: Octokit;
  private _request: Octokit['request'];
  private static _instance: Github | null;

  constructor(token: string) {
    this._octokit = new Octokit({
      auth: token,
    });

    this._request = this._octokit.request.defaults({
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
  }

  public static get instance(): Github {
    if (!Github._instance) {
      let token = '';

      if (conditionalToken) {
        token = import.meta.env.VITE_GITHUB_TOKEN;
      }

      Github._instance = new Github(token);
    }

    return Github._instance;
  }

  public static get octokit(): Octokit {
    return Github.instance._octokit;
  }

  public static get request(): Octokit['request'] {
    return Github.instance._request;
  }

  public static async findUsers(
    username: string,
    options: Partial<SearchUsernameOptions> = {}
  ) {
    return requestWrapper(async () => {
      const { data } = await this.request('GET /search/users', {
        q: username,
        ...options,
      });

      return data;
    });
  }

  public static async listRepos(
    username: string,
    options: Partial<ListUserReposOptions> = {}
  ) {
    return requestWrapper(async () => {
      const { data } = await this.request('GET /users/{username}/repos', {
        username: username,
        ...options,
      });

      return data;
    });
  }
}
