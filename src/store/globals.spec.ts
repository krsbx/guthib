import { useGlobalStore } from './globals';

describe('useGlobalStore', () => {
  beforeEach(() => {
    useGlobalStore.setState({
      isSearching: false,
      isInspecting: false,
      inspecting: '',
      isFetching: false,
      isError: false,
      error: '',
    });
  });

  it('should update isSearching', () => {
    useGlobalStore.getState().setIsSearching(true);
    expect(useGlobalStore.getState().isSearching).toBe(true);

    useGlobalStore.getState().setIsSearching((prev) => !prev);
    expect(useGlobalStore.getState().isSearching).toBe(false);
  });

  it('should update isInspecting', () => {
    useGlobalStore.getState().setIsInspecting(true);
    expect(useGlobalStore.getState().isInspecting).toBe(true);

    useGlobalStore.getState().setIsInspecting((prev) => !prev);
    expect(useGlobalStore.getState().isInspecting).toBe(false);
  });

  it('should update inspecting', () => {
    useGlobalStore.getState().setInspecting('abc');
    expect(useGlobalStore.getState().inspecting).toBe('abc');

    useGlobalStore.getState().setInspecting((prev) => prev + '123');
    expect(useGlobalStore.getState().inspecting).toBe('abc123');
  });

  it('should update isFetching', () => {
    useGlobalStore.getState().setIsFetching(true);
    expect(useGlobalStore.getState().isFetching).toBe(true);

    useGlobalStore.getState().setIsFetching((prev) => !prev);
    expect(useGlobalStore.getState().isFetching).toBe(false);
  });

  it('should update isError', () => {
    useGlobalStore.getState().setIsError(true);
    expect(useGlobalStore.getState().isError).toBe(true);

    useGlobalStore.getState().setIsError((prev) => !prev);
    expect(useGlobalStore.getState().isError).toBe(false);
  });

  it('should update error', () => {
    useGlobalStore.getState().setError('error!');
    expect(useGlobalStore.getState().error).toBe('error!');

    useGlobalStore.getState().setError((prev) => prev + '123');
    expect(useGlobalStore.getState().error).toBe('error!123');
  });
});
