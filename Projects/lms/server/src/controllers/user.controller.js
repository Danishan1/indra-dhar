import { UserService } from "../services/user.service.js";

export const UserController = {
  create: async (req, res) => {
    const data = await UserService.create({
      ...req.body,
      tenant_id: req.user.tenant_id,
    });
    res.json(data);
  },

  list: async (req, res) => {
    res.json(await UserService.list(req.user.tenant_id));
  },

  getById: async (req, res) => {
    res.json(await UserService.getById(req.params.id));
  },

  update: async (req, res) => {
    res.json(await UserService.update(req.params.id, req.body));
  },

  toggleStatus: async (req, res) => {
    res.json(await UserService.toggleStatus(req.params.id, req.body.is_active));
  },

  assignRole: async (req, res) => {
    res.json(await UserService.assignRole(req.params.id, req.body.role_id));
  },

  assignTeam: async (req, res) => {
    res.json(await UserService.assignTeam(req.params.id, req.body.team_id));
  },
};
