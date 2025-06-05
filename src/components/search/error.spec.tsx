import { useGlobalStore } from '@/store/globals';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { setupMatchMediaMock } from '../../../fixtures/test/match-media-mock';
import { sleep } from '../../../fixtures/test/sleep';
import { Provider } from '../ui/provider';
import SearchError from './error';

beforeAll(() => {
  setupMatchMediaMock();
});

describe('SearchError', () => {
  it('renders error dialog with message', async () => {
    useGlobalStore.setState({
      isError: true,
      error: 'Something went wrong',
      setIsError: vi.fn(),
    });
    
    const { container } = render(
      <Provider>
        <SearchError />
      </Provider>
    );
    
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(container.querySelector('.chakra-button')).toBeInTheDocument();
  });

  it('calls setIsError when dialog is closed', async () => {
    const setIsError = vi.fn();
    
    useGlobalStore.setState({
      isError: true,
      error: 'Something went wrong',
      setIsError,
    });

    const { container } = render(
      <Provider>
        <SearchError />
      </Provider>
    );

    const button = container.querySelector('.chakra-button');

    if (!button) {
      throw new Error('Button not found');
    }

    fireEvent.click(button);

    await sleep();

    expect(setIsError).toHaveBeenCalledWith(false);
  });
});
