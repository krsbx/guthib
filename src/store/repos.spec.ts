import { repoA, repoB, sampleRepos } from '../../fixtures/store/repos';
import { useReposStore } from './repos';

describe('useReposStore', () => {
  beforeEach(() => {
    useReposStore.setState({ repos: {} });
  });

  it('should set repos', () => {
    useReposStore.getState().setRepos({ alice: sampleRepos });
    expect(useReposStore.getState().repos).toEqual({ alice: sampleRepos });
  });

  it('should add repos for a new user', () => {
    useReposStore.getState().addRepos('bob', sampleRepos);
    expect(useReposStore.getState().repos.bob).toEqual(sampleRepos);
  });

  it('should add a single repo for a user', () => {
    useReposStore.getState().addRepos('carol', repoA);
    expect(useReposStore.getState().repos.carol).toEqual([repoA]);
  });

  it('should append repos for an existing user', () => {
    useReposStore.getState().addRepos('dave', repoA);
    useReposStore.getState().addRepos('dave', repoB);
    expect(useReposStore.getState().repos.dave).toEqual([repoA, repoB]);
  });

  it('should remove repos for a user', () => {
    useReposStore.getState().setRepos({ eve: sampleRepos });
    useReposStore.getState().removeRepos('eve');
    expect(useReposStore.getState().repos.eve).toBeUndefined();
  });
});
