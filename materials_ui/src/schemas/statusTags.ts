import { z } from 'zod';

export const StatusTagEnum = z.string();

export type StatusTag = z.infer<typeof StatusTagEnum>;
