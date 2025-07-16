import { useGlobalStore } from '@/store/globals';
import { useReposStore } from '@/store/repos';
import { useSearchStore } from '@/store/search';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { RequestError } from 'octokit';
import { repoA, repoB } from '../../../fixtures/store/repos';
import { userA } from '../../../fixtures/store/search';
import { setupMatchMediaMock } from '../../../fixtures/test/match-media-mock';
import { sleep } from '../../../fixtures/test/sleep';
import { Provider } from '../ui/provider';
import InspectionModal from './modal';

vi.mock('@/utils/github', async () => {
  const { sampleRepos } = await import('../../../fixtures/store/repos');

  return {
    Github: {
      listRepos: vi
        .fn()
        .mockResolvedValue({ isSuccess: true, data: sampleRepos }),
      getErrorMessage: vi.fn().mockResolvedValue('Something went wrong'),
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

    const { container } = render(
      <Provider>
        <InspectionModal />
      </Provider>
    );

    // Using the same logic as the one we use on the repo-skeleton
    expect(
      container.getElementsByClassName('chakra-stack').length
    ).toBeGreaterThan(3);
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

  it('calls addRepos when fetch is successful', async () => {
    const addRepos = vi.fn();

    useReposStore.setState({ addRepos, repos: {} });

    render(
      <Provider>
        <InspectionModal />
      </Provider>
    );

    await screen.findByText(userA.login);

    expect(addRepos).toHaveBeenCalled();
  });

  it('calls setIsInspecting and setInspecting on close', async () => {
    const setIsInspecting = vi.fn();
    const setInspecting = vi.fn();

    useGlobalStore.setState({ setIsInspecting, setInspecting });

    const { container } = render(
      <Provider>
        <InspectionModal />
      </Provider>
    );

    const closeTrigger = container.querySelector(
      '.chakra-dialog__closeTrigger'
    );

    if (!closeTrigger) {
      throw new Error('Close trigger not found');
    }

    fireEvent.click(closeTrigger);

    await sleep();

    expect(setIsInspecting).toHaveBeenCalledWith(false);
    expect(setInspecting).toHaveBeenCalledWith('');
  });

  it('calls setIsError and setError on RequestError', async () => {
    const { Github } = await import('@/utils/github');

    Github.listRepos = vi.fn().mockResolvedValue({
      isSuccess: false,
      error: new RequestError('Request failed', 400, {
        request: {
          headers: {},
          method: 'GET',
          url: '',
        },
      }),
    });

    const setIsError = vi.fn();
    const setError = vi.fn();

    useGlobalStore.setState({ setIsError, setError });
    useReposStore.setState({ addRepos: vi.fn(), repos: {} });

    render(
      <Provider>
        <InspectionModal />
      </Provider>
    );

    await screen.findByText(userA.login);

    expect(setIsError).toHaveBeenCalledWith(true);
    expect(setError).toHaveBeenCalledWith('Request failed');
  });

  it('calls setIsError and setError on failed fetch with a generic error', async () => {
    const { Github } = await import('@/utils/github');

    Github.listRepos = vi
      .fn()
      .mockResolvedValue({ isSuccess: false, error: new Error('fail') });

    const setIsError = vi.fn();
    const setError = vi.fn();

    useGlobalStore.setState({ setIsError, setError });
    useReposStore.setState({ addRepos: vi.fn(), repos: {} });

    render(
      <Provider>
        <InspectionModal />
      </Provider>
    );

    await screen.findByText(userA.login);

    expect(setIsError).toHaveBeenCalledWith(true);
    expect(setError).toHaveBeenCalledWith('fail');
  });

  it('calls setIsError and setError on failed fetch with a unknown error', async () => {
    const { Github } = await import('@/utils/github');

    Github.listRepos = vi
      .fn()
      .mockResolvedValue({ isSuccess: false, error: 'Something went wrong' });

    const setIsError = vi.fn();
    const setError = vi.fn();

    useGlobalStore.setState({ setIsError, setError });
    useReposStore.setState({ addRepos: vi.fn(), repos: {} });

    render(
      <Provider>
        <InspectionModal />
      </Provider>
    );

    await screen.findByText(userA.login);

    expect(setIsError).toHaveBeenCalledWith(true);
    expect(setError).toHaveBeenCalledWith('Something went wrong');
  });
});
