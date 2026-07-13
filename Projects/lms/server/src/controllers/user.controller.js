import { UserService } from "../services/user.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { validate } from "../utils/validate.js";
import { UserValidator } from "../validators/user.validator.js";

export const UserController = {
  create: async (req, res) => {
    const body = validate(UserValidator.create, req.body);

    const data = await UserService.create({
      ...body,
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
    const { id } = validate(UserValidator.idParam, req.params);

    const data = await UserService.getById(id);

    return ApiResponse.success({
      res,
      data,
      message: "User fetched successfully",
    });
  },

  update: async (req, res) => {
    const { id } = validate(UserValidator.idParam, req.params);
    const body = validate(UserValidator.update, req.body);

    const data = await UserService.update(id, body);

    return ApiResponse.success({
      res,
      data,
      message: "User updated successfully",
    });
  },

  toggleStatus: async (req, res) => {
    const { id } = validate(UserValidator.idParam, req.params);
    const body = validate(UserValidator.toggleStatus, req.body);

    const data = await UserService.toggleStatus(id, body.is_active);

    return ApiResponse.success({
      res,
      data,
      message: "User status updated successfully",
    });
  },

  assignTeam: async (req, res) => {
    const { id } = validate(UserValidator.idParam, req.params);
    const body = validate(UserValidator.assignTeam, req.body);

    const data = await UserService.assignTeam(id, body.team_id, body.is_leader);

    return ApiResponse.success({
      res,
      data,
      message: "User added to team successfully",
    });
  },

  removeFromTeam: async (req, res) => {
    const { id, teamId } = validate(UserValidator.removeFromTeam, req.params);

    const data = await UserService.removeFromTeam(id, teamId);

    return ApiResponse.success({
      res,
      data,
      message: "User removed from team successfully",
    });
  },
};
