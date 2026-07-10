import { z } from "zod";

export const workflowKeySchema = z.object({
  key: z.string().min(1, "Workflow key is required"),
});

export const executionIdSchema = z.object({
  id: z.string().min(1, "Execution id is required"),
});

export const updateWorkflowSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  config: z.record(z.any()).optional(),
  is_active: z.boolean().optional(),
});

export const executionQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  status: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});
