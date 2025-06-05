import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { repoA } from '../../../fixtures/store/repos';
import { setupMatchMediaMock } from '../../../fixtures/test/match-media-mock';
import GithubRepo from './repo';
import { Provider } from '../ui/provider';

beforeAll(() => {
  setupMatchMediaMock();
});

describe('GithubRepo', () => {
  it('renders repo name, description, and stargazers', () => {
    const repo = { ...repoA, description: 'A test repo' };

    render(
      <Provider>
        <GithubRepo repo={repo} />
      </Provider>
    );

    expect(screen.getByText('repo1')).toBeInTheDocument();
    expect(screen.getByText('A test repo')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(document.querySelector('svg')).toBeInTheDocument();
  });

  it('does not render description if missing', () => {
    const repoNoDesc = { ...repoA, description: null };

    render(
      <Provider>
        <GithubRepo repo={repoNoDesc} />
      </Provider>
    );

    expect(screen.queryByText('A test repo')).not.toBeInTheDocument();
  });

  it('does not render stargazers if stargazers_count is undefined', () => {
    const repoNoStars = { ...repoA, stargazers_count: undefined };

    render(
      <Provider>
        <GithubRepo repo={repoNoStars} />
      </Provider>
    );

    expect(screen.queryByText('42')).not.toBeInTheDocument();
  });
});
