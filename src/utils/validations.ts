import { z } from 'zod';

export const searchSchema = z.object({
  username: z
    .string({
      message: 'Username is required',
    })
    .min(3, 'Username must be at least 3 characters'),
});

export type SearchSchema = z.infer<typeof searchSchema>;

export const filterSchema = z.object({
  maxPerPage: z
    .string()
    .min(1, 'Maximum items to display is required')
    .transform((value, ctx) => {
      const parsedValue = parseInt(value, 10);

      if (isNaN(parsedValue)) {
        ctx.addIssue({
          code: 'custom',
          message: 'Maximum items to display must be a number',
        });

        return 10;
      }

      if (parsedValue < 5) {
        ctx.addIssue({
          code: 'custom',
          message: 'The minimum value is 5',
        });

        return 5;
      }

      if (parsedValue > 30) {
        ctx.addIssue({
          code: 'custom',
          message: 'The maximum value is 30',
        });

        return 30;
      }

      return parsedValue;
    }),
});

export type FilterSchema = z.infer<typeof filterSchema>;
