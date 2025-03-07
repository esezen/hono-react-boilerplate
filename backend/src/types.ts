import { z } from "zod";

export const Task = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  completed: z.boolean().default(false),
  due_date: z.string().datetime(),
});
