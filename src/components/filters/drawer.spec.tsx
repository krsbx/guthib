import { useSearchStore } from '@/store/search';
import { OrderBy, SortBy } from '@/utils/constants';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { setupMatchMediaMock } from '../../../fixtures/test/match-media-mock';
import { Provider } from '../ui/provider';
import FilterDrawer from './drawer';

beforeAll(() => {
  setupMatchMediaMock();
});

describe('FilterDrawer', () => {
  beforeEach(() => {
    useSearchStore.setState({
      isFilterOpen: true,
      filters: {
        sortBy: SortBy.BEST_MATCH,
        orderBy: OrderBy.DESC,
        page: 1,
        maxPerPage: 10,
      },
      username: '',
      users: [],
    });
  });

  it('renders filter drawer with all filter fields', () => {
    render(
      <Provider>
        <FilterDrawer />
      </Provider>
    );

    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByText('Sort By')).toBeInTheDocument();
    expect(screen.getByText('Order By')).toBeInTheDocument();
    expect(screen.getByText('Max Items')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Enter max items to show')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  it('calls setFilter when changing sortBy and orderBy', async () => {
    const setFilter = vi.fn();
    useSearchStore.setState({ setFilter });

    render(
      <Provider>
        <FilterDrawer />
      </Provider>
    );

    const sortByRadio = await screen.findByDisplayValue(
      SortBy.BEST_MATCH
    );

    if (!sortByRadio) {
      throw new Error('Sort by radio not found');
    }

    fireEvent.click(sortByRadio);

    expect(useSearchStore.getState().filters.sortBy).toBe(SortBy.BEST_MATCH);

    const orderByRadio = await screen.findByDisplayValue(OrderBy.DESC);

    if (!orderByRadio) {
      throw new Error('Order by radio not found');
    }

    fireEvent.click(orderByRadio);

    expect(useSearchStore.getState().filters.orderBy).toBe(OrderBy.DESC);
  });

  it('shows validation error for invalid maxPerPage', async () => {
    render(
      <Provider>
        <FilterDrawer />
      </Provider>
    );

    const input = screen.getByPlaceholderText('Enter max items to show');

    fireEvent.change(input, { target: { value: 'abc' } });
    fireEvent.blur(input);

    expect(
      await screen.findByText('Maximum items to display is required')
    ).toBeInTheDocument();
  });

  it('calls resetFilters and closes drawer on cancel', () => {
    const resetFilters = vi.fn();
    const toggleFilter = vi.fn();

    useSearchStore.setState({ resetFilters, toggleFilter });

    render(
      <Provider>
        <FilterDrawer />
      </Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    expect(resetFilters).toHaveBeenCalled();
    expect(toggleFilter).toHaveBeenCalled();
  });

  it('calls setFilter and closes drawer on save if maxPerPage changed', () => {
    const setFilter = vi.fn();
    const toggleFilter = vi.fn();
    useSearchStore.setState({
      setFilter,
      toggleFilter,
      filters: {
        sortBy: SortBy.BEST_MATCH,
        orderBy: OrderBy.DESC,
        page: 1,
        maxPerPage: 10,
      },
    });

    render(
      <Provider>
        <FilterDrawer />
      </Provider>
    );

    const input = screen.getByPlaceholderText('Enter max items to show');

    fireEvent.change(input, { target: { value: '15' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(setFilter).toHaveBeenCalledWith('maxPerPage', 15);
    expect(toggleFilter).toHaveBeenCalled();
  });
});
