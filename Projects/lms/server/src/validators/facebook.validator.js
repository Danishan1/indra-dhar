import { z } from "zod";

export const facebookWebhookSchema = z.object({
  object: z.literal("page"),

  entry: z.array(
    z.object({
      id: z.string(),

      changes: z.array(
        z.object({
          field: z.literal("leadgen"),

          value: z.object({
            leadgen_id: z.string(),
            page_id: z.string(),
            form_id: z.string().optional(),
            ad_id: z.string().optional(),
            campaign_id: z.string().optional(),
          }),
        }),
      ),
    }),
  ),
});

export const facebookVerificationSchema = z.object({
  "hub.mode": z.string(),
  "hub.verify_token": z.string(),
  "hub.challenge": z.string(),
});
