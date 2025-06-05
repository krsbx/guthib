import { userA } from '../../../fixtures/store/search';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import GithubProfile from './profile';
import { Provider } from '../ui/provider';
import { setupMatchMediaMock } from '../../../fixtures/test/match-media-mock';

describe('GithubProfile', () => {
  beforeAll(() => {
    setupMatchMediaMock();
  });

  it('renders user name, login, followers, and following', () => {
    const user = {
      ...userA,
      name: 'The Octocat',
      followers: 100,
      following: 50,
    };

    render(
      <Provider>
        <GithubProfile user={user} />
      </Provider>
    );
    
    expect(screen.getByText('The Octocat')).toBeInTheDocument();
    expect(screen.getByText('octocat')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
  });

  it('renders login if name is missing', () => {
    const userNoName = { ...userA, name: undefined };

    render(
      <Provider>
        <GithubProfile user={userNoName} />
      </Provider>
    );

    expect(screen.queryByText('The Octocat')).not.toBeInTheDocument();
    expect(screen.getByText('octocat')).toBeInTheDocument();
  });

  it('renders only login if followers/following are missing', () => {
    const userNoStats = {
      ...userA,
      followers: undefined,
      following: undefined,
    };

    render(
      <Provider>
        <GithubProfile user={userNoStats} />
      </Provider>
    );

    expect(screen.getByText('octocat')).toBeInTheDocument();
    expect(screen.queryByText('100')).not.toBeInTheDocument();
    expect(screen.queryByText('50')).not.toBeInTheDocument();
  });
});
