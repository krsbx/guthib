import { describe, expect, it } from 'vitest';
import { filterSchema, searchSchema } from './validations';

describe('searchSchema', () => {
  it('passes with valid username', () => {
    const result = searchSchema.safeParse({ username: 'abc' });

    expect(result.success).toBe(true);
  });

  it('fails with short username', () => {
    const result = searchSchema.safeParse({ username: 'ab' });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].message).toContain('at least 3');
    }
  });
});

describe('filterSchema', () => {
  it('parses valid maxPerPage within range', () => {
    const result = filterSchema.safeParse({ maxPerPage: '10' });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.maxPerPage).toBe(10);
    }
  });

  it('throws an error when maxPerPage below minimum and adds issue', () => {
    const result = filterSchema.safeParse({ maxPerPage: '2' });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].message).toContain(
        'The minimum value is 5'
      );
    }
  });

  it('throw an error maxPerPage above maximum and adds issue', () => {
    const result = filterSchema.safeParse({ maxPerPage: '50' });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].message).toContain(
        'The maximum value is 30'
      );
    }
  });

  it('fails when maxPerPage is empty', () => {
    const result = filterSchema.safeParse({ maxPerPage: '' });
    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].message).toContain(
        'Maximum items to display is required'
      );
    }
  });

  it('throw an error and adds issue when maxPerPage is not a number', () => {
    const result = filterSchema.safeParse({ maxPerPage: 'abc' });
    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].message).toContain(
        'Maximum items to display must be a number'
      );
    }
  });
});
