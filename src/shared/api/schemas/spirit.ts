// @ts-ignore
import { z } from 'zod';

export const spiritSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  threatLevel: z.enum(['low', 'medium', 'high', 'critical']),
  location: z.string().min(1),
  status: z.enum(['active', 'capturing', 'captured']),
  lastUpdated: z.string().datetime()
});

export const spiritsArraySchema = z.array(spiritSchema);

export type Spirit = z.infer<typeof spiritSchema>;