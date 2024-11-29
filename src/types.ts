import { z } from 'zod';

export const MessageSchema = z.union([
  z.object({
    type: z.literal('select'),
    content: z.string(),
    options: z.array(z.string()),
  }),
  z.object({ type: z.literal('question'), content: z.string() }),
  z.object({ type: z.literal('confirmation'), content: z.string() }),
  z.object({ type: z.literal('end'), content: z.string() }),
]);
