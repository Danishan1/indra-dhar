import { z } from "zod";

export const TeamValidator = {
  idParam: z.object({
    id: z.uuid(),
  }),

  memberParam: z.object({
    id: z.uuid(),
    userId: z.uuid(),
  }),

  create: z.object({
    name: z.string().min(2).max(150),

    description: z.string().max(500).optional().nullable(),

    parent_team_id: z.uuid().optional().nullable(),
  }),

  update: z.object({
    name: z.string().min(2).max(150).optional(),

    description: z.string().max(500).optional().nullable(),

    parent_team_id: z.uuid().optional().nullable(),
  }),

  addMember: z.object({
    user_id: z.uuid(),

    is_leader: z.boolean().optional().default(false),
  }),

  setLeader: z.object({
    user_id: z.uuid(),

    is_leader: z.boolean(),
  }),
};
