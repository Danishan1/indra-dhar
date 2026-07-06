import { z } from "zod";

const uuid = z.string().uuid();

export const createLeadSchema = z.object({
  lead_number: z.string().min(1).max(50),
  first_name: z.string().min(1).max(100),

  last_name: z.string().max(100).optional().nullable(),
  company: z.string().max(200).optional().nullable(),
  mobile: z.string().max(20).optional().nullable(),
  email: z.string().email().optional().nullable(),

  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  postal_code: z.string().optional().nullable(),

  product_interest: z.string().optional().nullable(),
  budget: z.coerce.number().optional().nullable(),

  source_id: uuid.optional().nullable(),
  priority_id: uuid.optional().nullable(),
  pipeline_id: uuid.optional().nullable(),
  stage_id: uuid.optional().nullable(),
  assigned_to: uuid.optional().nullable(),
  manager_id: uuid.optional().nullable(),
  team_id: uuid.optional().nullable(),
});

export const updateLeadSchema = createLeadSchema.partial();

export const leadIdSchema = z.object({
  id: uuid,
});

export const assignLeadSchema = z.object({
  to_user: uuid,
});

export const stageSchema = z.object({
  stage_id: uuid,
});

export const statusSchema = z.object({
  status: z.enum(["OPEN", "CONTACTED", "QUALIFIED", "LOST", "WON"]),
});

export const noteSchema = z.object({
  note: z.string().min(1).max(5000),
});

export const listLeadSchema = z.object({
  page: z.coerce.number().positive().optional(),
  limit: z.coerce.number().positive().optional(),
  search: z.string().optional(),
  stage_id: uuid.optional(),
  pipeline_id: uuid.optional(),
  assigned_to: uuid.optional(),
});
