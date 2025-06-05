import { useGlobalStore } from '@/store/globals';
import { useSearchStore } from '@/store/search';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { userA } from '../../../fixtures/store/search';
import { setupMatchMediaMock } from '../../../fixtures/test/match-media-mock';
import { Provider } from '../ui/provider';
import SearchContainer from './container';

beforeAll(() => {
  setupMatchMediaMock();
});

describe('SearchContainer', () => {
  beforeEach(() => {
    useGlobalStore.setState({
      isSearching: false,
      setInspecting: vi.fn(),
      setIsInspecting: vi.fn(),
    });
    useSearchStore.setState({
      username: '',
      users: [],
    });
  });

  it('renders nothing if username is empty', () => {
    render(
      <Provider>
        <SearchContainer />
      </Provider>
    );
    expect(screen.queryByText(/Showing/)).not.toBeInTheDocument();
  });

  it('renders skeletons when isFetching is true', () => {
    useGlobalStore.setState({ isSearching: true });

    const { container } = render(
      <Provider>
        <SearchContainer />
      </Provider>
    );

    const skeletons = container.getElementsByClassName('chakra-stack');

    // There should be 2 skeleton rows for each cards skeleton
    // > We use 6 dummy skeleton cards => 12
    expect(skeletons.length).toBeGreaterThanOrEqual(12);
  });

  it('renders user results and handles click', () => {
    const setInspecting = vi.fn();
    const setIsInspecting = vi.fn();

    useGlobalStore.setState({ setInspecting, setIsInspecting });
    useSearchStore.setState({ username: 'octocat', users: [userA] });

    render(
      <Provider>
        <SearchContainer />
      </Provider>
    );

    expect(
      screen.getByText('Showing 1 results for "octocat"')
    ).toBeInTheDocument();

    const userButton = screen.getByRole('button');
    fireEvent.click(userButton);
    
    expect(setInspecting).toHaveBeenCalledWith(userA.login);
    expect(setIsInspecting).toHaveBeenCalledWith(true);
  });
});
