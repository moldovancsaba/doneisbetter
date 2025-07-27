import { z } from 'zod';

// API Request Validation
export const SwipeRequestSchema = z.object({
  sessionId: z.string().uuid(),
  cardId: z.string().uuid(),
  direction: z.enum(['left', 'right'])
});

export const VoteRequestSchema = z.object({
  sessionId: z.string().uuid(),
  cardA: z.string().uuid(),
  cardB: z.string().uuid(),
  winner: z.string().uuid()
}).refine(data => data.winner === data.cardA || data.winner === data.cardB, {
  message: "Winner must be either cardA or cardB"
});

export const CreateCardSchema = z.object({
  type: z.enum(['text', 'media']),
  content: z.object({
    text: z.string().optional(),
    mediaUrl: z.string().url().optional()
  }).refine(data =>
    (data.text && !data.mediaUrl) || (!data.text && data.mediaUrl), {
    message: "Must provide either text or mediaUrl, not both"
  }),
  title: z.string().optional(),
  tags: z.array(z.string()).optional()
});

export const CreateSessionSchema = z.object({});
