import { RequestError } from 'octokit';

export async function requestWrapper<T>(fn: () => Promise<T>) {
  try {
    const data = await fn();

    return {
      isSuccess: true,
      data: data,
    } as const;
  } catch (err) {
    if (err instanceof RequestError) {
      return {
        isSuccess: false,
        error: err,
      } as const;
    }

    return {
      isSuccess: false,
      error: err,
    } as const;
  }
}
