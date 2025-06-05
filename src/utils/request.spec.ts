import { RequestError } from 'octokit';
import { describe, expect, it, vi } from 'vitest';
import { requestWrapper } from './request';

describe('requestWrapper', () => {
  it('returns success when the function resolves', async () => {
    const mockData = { foo: 'bar' };
    const fn = vi.fn().mockResolvedValue(mockData);

    const result = await requestWrapper(fn);

    expect(result.isSuccess).toBe(true);
    expect(result.data).toEqual(mockData);
  });

  it('returns error when the function rejects with RequestError', async () => {
    const error = new RequestError('Request failed', 400, {
      request: {
        headers: {},
        method: 'GET',
        url: '',
      },
    });
    const fn = vi.fn().mockRejectedValue(error);

    const result = await requestWrapper(fn);

    expect(result.isSuccess).toBe(false);
    expect(result.error).toBe(error);
    expect(result.error).toBeInstanceOf(RequestError);
  });

  it('returns error when the function rejects with a generic error', async () => {
    const error = new Error('Something went wrong');
    const fn = vi.fn().mockRejectedValue(error);

    const result = await requestWrapper(fn);

    expect(result.isSuccess).toBe(false);
    expect(result.error).toBe(error);
    expect(result.error).toBeInstanceOf(Error);
  });
});
