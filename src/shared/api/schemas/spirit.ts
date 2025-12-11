import { z } from 'zod';

export const spiritSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  threatLevel: z.enum(['low', 'medium', 'high', 'critical']),
  location: z.string().min(1),
  status: z.enum(['active', 'capturing', 'captured']),
  lastUpdated: z.string().datetime()
});

export type Spirit = z.infer<typeof spiritSchema>;