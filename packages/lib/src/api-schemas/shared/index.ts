import z from 'zod';

export const idSchema = z.object({
  id: z.string(),
});

export const epochDateSchema = z.number().int().nonnegative();

export const stringEpochDateSchema = z
  .string()
  .pipe(z.coerce.number().int().nonnegative());
