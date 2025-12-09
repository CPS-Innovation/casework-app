import { z } from 'zod';

export const BaseUrlParamsSchema = z
  .object({ caseId: z.string(), urn: z.string() })
  .catchall(z.string());

export type BaseUrlParamsType = z.infer<typeof BaseUrlParamsSchema>;
