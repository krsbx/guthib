import { SkeletonText } from '@chakra-ui/react';

function GithubRepoSkeleton() {
  return [1, 2, 3].map((index) => (
    <SkeletonText mt="4" noOfLines={2} key={`repo-skeleton-${index}`} />
  ));
}

export default GithubRepoSkeleton;
