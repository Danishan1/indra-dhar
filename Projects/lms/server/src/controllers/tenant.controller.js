import { TenantService } from "../services/tenant.service.js";

export const TenantController = {
  create: async (req, res) => {
    const data = await TenantService.create(req.body);
    res.json(data);
  },

  list: async (req, res) => {
    res.json(await TenantService.list());
  },

  getById: async (req, res) => {
    res.json(await TenantService.getById(req.params.id));
  },

  update: async (req, res) => {
    res.json(await TenantService.update(req.params.id, req.body));
  },

  remove: async (req, res) => {
    res.json(await TenantService.remove(req.params.id));
  },
};
