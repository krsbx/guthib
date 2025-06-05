import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { setupMatchMediaMock } from '../../../fixtures/test/match-media-mock';
import { useGlobalStore } from '@/store/globals';
import { useReposStore } from '@/store/repos';
import { useSearchStore } from '@/store/search';
import InspectionModal from './modal';
import { userA } from '../../../fixtures/store/search';
import { repoA, repoB } from '../../../fixtures/store/repos';
import { Provider } from '../ui/provider';

vi.mock('@/utils/github', async () => {
  const { sampleRepos } = await import('../../../fixtures/store/repos');

  return {
    Github: {
      listRepos: vi
        .fn()
        .mockResolvedValue({ isSuccess: true, data: sampleRepos }),
    },
  };
});

beforeAll(() => {
  setupMatchMediaMock();
});

describe('InspectionModal', () => {
  beforeEach(() => {
    useGlobalStore.setState({
      inspecting: userA.login,
      isInspecting: true,
      setIsInspecting: vi.fn(),
      setInspecting: vi.fn(),
      isFetching: false,
      setIsFetching: vi.fn(),
      setError: vi.fn(),
      setIsError: vi.fn(),
      error: '',
      isError: false,
    });
    
    useSearchStore.setState({ users: [userA] });
    useReposStore.setState({
      repos: { [userA.login]: [repoA, repoB] },
      addRepos: vi.fn(),
    });
  });

  it('renders user profile and repos when open', () => {
    render(
      <Provider>
        <InspectionModal />
      </Provider>
    );
    expect(screen.getByText(userA.login)).toBeInTheDocument();
    expect(screen.getByText(repoA.name)).toBeInTheDocument();
    expect(screen.getByText(repoB.name)).toBeInTheDocument();
  });

  it('renders skeleton when isFetching is true', () => {
    useGlobalStore.setState({ isFetching: true });

    const { container }=render(
      <Provider>
        <InspectionModal />
      </Provider>
    );

    // Using the same logic as the one we use on the repo-skeleton
    expect(container.getElementsByClassName('chakra-stack').length).toBeGreaterThan(3);
  });

  it('renders nothing if user is not found', () => {
    useGlobalStore.setState({ inspecting: 'notfound' });
    
    render(
      <Provider>
        <InspectionModal />
      </Provider>
    );
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
