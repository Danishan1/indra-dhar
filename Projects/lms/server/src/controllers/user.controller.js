import { UserService } from "../services/user.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const UserController = {
  create: async (req, res) => {
    const data = await UserService.create({
      ...req.body,
      tenant_id: req.user.tenant_id,
    });

    return ApiResponse.created({
      res,
      data,
      message: "User created successfully",
    });
  },

  list: async (req, res) => {
    const data = await UserService.list(req.user.tenant_id);

    return ApiResponse.success({
      res,
      data,
      message: "Users fetched successfully",
    });
  },

  getById: async (req, res) => {
    const data = await UserService.getById(req.params.id);

    return ApiResponse.success({
      res,
      data,
      message: "User fetched successfully",
    });
  },

  update: async (req, res) => {
    const data = await UserService.update(req.params.id, req.body);

    return ApiResponse.success({
      res,
      data,
      message: "User updated successfully",
    });
  },

  toggleStatus: async (req, res) => {
    const data = await UserService.toggleStatus(
      req.params.id,
      req.body.is_active,
    );

    return ApiResponse.success({
      res,
      data,
      message: "User status updated successfully",
    });
  },

  assignRole: async (req, res) => {
    const data = await UserService.assignRole(req.params.id, req.body.role_id);

    return ApiResponse.success({
      res,
      data,
      message: "Role assigned successfully",
    });
  },

  assignTeam: async (req, res) => {
    const data = await UserService.assignTeam(req.params.id, req.body.team_id);

    return ApiResponse.success({
      res,
      data,
      message: "Team assigned successfully",
    });
  },
};
