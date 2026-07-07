import { z } from "zod";

export const indiaMartWebhookSchema = z.object({
  query_id: z.string(),
});
