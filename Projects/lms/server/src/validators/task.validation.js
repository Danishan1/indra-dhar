import { z } from "zod";

const uuid = z.string().uuid();

export const createTaskSchema = z.object({
  lead_id: uuid.nullish(),
  assigned_to: uuid,
  team_id: uuid,

  title: z.string().min(3).max(255),

  description: z.string().optional(),

  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),

  due_date: z.coerce.date(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(3).max(255).optional(),
  lead_id: uuid.nullish().optional().nullable(),
  assigned_to: uuid.optional().nullable(),
  team_id: uuid.optional().nullable(),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  due_date: z.coerce.date().optional(),
});

export const assignTaskSchema = z.object({
  team_id: uuid,
  assigned_to: uuid,
});

export const changeStatusSchema = z.object({
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
});

export const outcomeSchema = z.object({
  outcome: z.string().min(1).max(50),
});

export const commentSchema = z.object({
  comment: z.string().trim().min(1).max(5000),
});

export const taskCommentQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(50),
  offset: z.coerce.number().min(0).default(0),
});

export const idParamSchema = z.object({
  id: z.string().uuid("Invalid ID"),
});
