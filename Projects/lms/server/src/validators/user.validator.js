import { z } from "zod";

export const UserValidator = {
  create: z.object({
    first_name: z.string().min(1).max(100),
    last_name: z.string().max(100).optional().nullable(),

    email: z.email(),

    mobile: z.string().max(20).optional().nullable(),

    password: z.string().min(8),

    manager_id: z.uuid().optional().nullable(),
  }),

  update: z.object({
    first_name: z.string().min(1).max(100).optional(),
    last_name: z.string().max(100).optional().nullable(),
    mobile: z.string().max(20).optional().nullable(),
    avatar_url: z.string().url().optional().nullable(),
    manager_id: z.uuid().optional().nullable(),
  }),

  toggleStatus: z.object({
    is_active: z.boolean(),
  }),

  assignTeam: z.object({
    team_id: z.uuid(),
    is_leader: z.boolean().optional().default(false),
  }),
};
