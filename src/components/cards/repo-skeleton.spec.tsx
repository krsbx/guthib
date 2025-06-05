import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { setupMatchMediaMock } from '../../../fixtures/test/match-media-mock';
import GithubRepoSkeleton from './repo-skeleton';
import { Provider } from '../ui/provider';

beforeAll(() => {
  setupMatchMediaMock();
});

describe('GithubRepoSkeleton', () => {
  it('renders three SkeletonText components', () => {
    const { container } = render(
      <Provider>
        <GithubRepoSkeleton />
      </Provider>
    );

    const skeletons = container.getElementsByClassName('chakra-stack');

    // Expect 3 since the `SekeletonText` component is rendered with Stack components 3 times
    expect(skeletons).toHaveLength(3);
  });
});
