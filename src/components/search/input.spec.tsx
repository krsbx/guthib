import { useGlobalStore } from '@/store/globals';
import { useSearchStore } from '@/store/search';
import { SortBy } from '@/utils/constants';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { userA } from '../../../fixtures/store/search';
import { setupMatchMediaMock } from '../../../fixtures/test/match-media-mock';
import { sleep } from '../../../fixtures/test/sleep';
import { Provider } from '../ui/provider';
import SearchInput from './input';
import { RequestError } from 'octokit';

vi.mock('@/utils/github', async () => {
  const { userA } = await import('../../../fixtures/store/search');

  return {
    Github: {
      findUsers: vi.fn().mockResolvedValue({
        isSuccess: true,
        data: { items: [userA] },
      }),
    },
  };
});

beforeAll(() => {
  setupMatchMediaMock();
});

describe('SearchInput', () => {
  beforeEach(() => {
    useGlobalStore.setState({
      isSearching: false,
      setIsSearching: vi.fn(),
      setIsError: vi.fn(),
      setError: vi.fn(),
    });

    useSearchStore.setState({
      isFilterOpen: false,
      toggleFilter: vi.fn(),
      filters: {
        sortBy: SortBy.BEST_MATCH,
        orderBy: 'desc',
        page: 1,
        maxPerPage: 10,
      },
      setUsers: vi.fn(),
      setUsername: vi.fn(),
    });
  });

  it('renders input and buttons', () => {
    render(
      <Provider>
        <SearchInput />
      </Provider>
    );

    expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
    expect(screen.getAllByRole('button').length).toBe(2);
  });

  it('calls toggleFilter when filter button is clicked', async () => {
    const toggleFilter = vi.fn();
    
    useSearchStore.setState({ toggleFilter });

    render(
      <Provider>
        <SearchInput />
      </Provider>
    );

    const filterButton = screen.getAllByRole('button')[0];

    fireEvent.click(filterButton);

    await sleep();

    expect(toggleFilter).toHaveBeenCalled();
  });

  it('shows validation error if username is empty and submit is clicked', async () => {
    render(
      <Provider>
        <SearchInput />
      </Provider>
    );

    const submitButton = screen.getAllByRole('button')[1];
    fireEvent.click(submitButton);

    await sleep();

    expect(await screen.findByText('Username is required')).toBeInTheDocument();
  });

  it('calls setUsername and setUsers on successful submit', async () => {
    const setUsername = vi.fn();
    const setUsers = vi.fn();

    useSearchStore.setState({ setUsername, setUsers });

    render(
      <Provider>
        <SearchInput />
      </Provider>
    );

    const input = screen.getByPlaceholderText('Enter username');
    fireEvent.change(input, { target: { value: 'octocat' } });

    const submitButton = screen.getAllByRole('button')[1];
    fireEvent.click(submitButton);

    await sleep();

    expect(setUsername).toHaveBeenCalledWith('octocat');
    expect(setUsers).toHaveBeenCalledWith([userA]);
  });

  it('calls setIsError and setError on RequestError', async () => {
    const { Github } = await import('@/utils/github');

    Github.findUsers = vi.fn().mockResolvedValue({
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

    render(
      <Provider>
        <SearchInput />
      </Provider>
    );

    const input = screen.getByPlaceholderText('Enter username');
    fireEvent.change(input, { target: { value: 'octocat' } });

    const submitButton = screen.getAllByRole('button')[1];
    fireEvent.click(submitButton);

    await sleep();

    expect(setIsError).toHaveBeenCalledWith(true);
    expect(setError).toHaveBeenCalledWith('Request failed');
  });

  it('calls setIsError and setError on generic error', async () => {
    const { Github } = await import('@/utils/github');

    Github.listRepos = vi.fn().mockResolvedValue({
      isSuccess: false,
      error: new Error('fail'),
    });

    const setIsError = vi.fn();
    const setError = vi.fn();

    useGlobalStore.setState({ setIsError, setError });

    render(
      <Provider>
        <SearchInput />
      </Provider>
    );

    const input = screen.getByPlaceholderText('Enter username');
    fireEvent.change(input, { target: { value: 'octocat' } });

    const submitButton = screen.getAllByRole('button')[1];
    fireEvent.click(submitButton);

    await sleep();

    expect(setIsError).toHaveBeenCalledWith(true);
    expect(setError).toBeCalled();
  });

  it('calls setIsError and setError on unknown error', async () => {
    const { Github } = await import('@/utils/github');

    Github.listRepos = vi.fn().mockResolvedValue({
      isSuccess: false,
      error: 'Something went wrong',
    });

    const setIsError = vi.fn();
    const setError = vi.fn();

    useGlobalStore.setState({ setIsError, setError });

    render(
      <Provider>
        <SearchInput />
      </Provider>
    );

    const input = screen.getByPlaceholderText('Enter username');
    fireEvent.change(input, { target: { value: 'octocat' } });

    const submitButton = screen.getAllByRole('button')[1];
    fireEvent.click(submitButton);

    await sleep();

    expect(setIsError).toHaveBeenCalledWith(true);
    expect(setError).toBeCalled();
  });
});
