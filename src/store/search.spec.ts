import { OrderBy, SortBy } from '@/utils/constants';
import { beforeEach, describe, expect, it } from 'vitest';
import { sampleUsers } from '../../fixtures/store/search';
import { useGlobalStore } from './globals';
import { useSearchStore } from './search';

describe('useSearchStore', () => {
  beforeEach(() => {
    useGlobalStore.setState({
      isFilterOpen: false,
    });

    useSearchStore.setState({
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

  it('should toggle, open, and close filter', () => {
    useGlobalStore.getState().toggleFilter();

    expect(useGlobalStore.getState().isFilterOpen).toBe(true);

    useGlobalStore.getState().closeFilter();

    expect(useGlobalStore.getState().isFilterOpen).toBe(false);

    useGlobalStore.getState().openFilter();

    expect(useGlobalStore.getState().isFilterOpen).toBe(true);
  });

  it('should reset and set filters', () => {
    useSearchStore.getState().setFilter('sortBy', SortBy.FOLLOWERS);
    useSearchStore.getState().setFilter('orderBy', OrderBy.ASC);
    useSearchStore.getState().setFilter('page', 3);
    useSearchStore.getState().setFilter('maxPerPage', 25);

    expect(useSearchStore.getState().filters).toEqual({
      sortBy: SortBy.FOLLOWERS,
      orderBy: OrderBy.ASC,
      page: 3,
      maxPerPage: 25,
    });

    useSearchStore.getState().resetFilters();

    expect(useSearchStore.getState().filters).toEqual({
      sortBy: SortBy.BEST_MATCH,
      orderBy: OrderBy.DESC,
      page: 1,
      maxPerPage: 10,
    });
  });

  it('should set username directly and functionally', () => {
    useSearchStore.getState().setUsername('alice');

    expect(useSearchStore.getState().username).toBe('alice');

    useSearchStore.getState().setUsername((prev) => prev + '123');

    expect(useSearchStore.getState().username).toBe('alice123');
  });

  it('should set users', () => {
    useSearchStore.getState().setUsers(sampleUsers);

    expect(useSearchStore.getState().users).toEqual(sampleUsers);
  });
});
