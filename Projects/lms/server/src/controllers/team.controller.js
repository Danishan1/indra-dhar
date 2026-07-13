import { TeamService } from "../services/team.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { validate } from "../utils/validate.js";
import { TeamValidator } from "../validators/team.validator.js";

export const TeamController = {
  create: async (req, res) => {
    const body = validate(TeamValidator.create, req.body);

    const data = await TeamService.create({
      ...body,
      tenant_id: req.user.tenant_id,
    });

    return ApiResponse.created({
      res,
      data,
      message: "Team created successfully",
    });
  },

  list: async (req, res) => {
    const data = await TeamService.list(req.user.tenant_id);

    return ApiResponse.success({
      res,
      data,
      message: "Teams fetched successfully",
    });
  },

  getById: async (req, res) => {
    const { id } = validate(TeamValidator.idParam, req.params);

    const data = await TeamService.getById(id);

    return ApiResponse.success({
      res,
      data,
      message: "Team fetched successfully",
    });
  },

  update: async (req, res) => {
    const { id } = validate(TeamValidator.idParam, req.params);

    const body = validate(TeamValidator.update, req.body);

    const data = await TeamService.update(id, body);

    return ApiResponse.success({
      res,
      data,
      message: "Team updated successfully",
    });
  },

  remove: async (req, res) => {
    const { id } = validate(TeamValidator.idParam, req.params);

    const data = await TeamService.remove(id);

    return ApiResponse.success({
      res,
      data,
      message: "Team deleted successfully",
    });
  },

  listMembers: async (req, res) => {
    const { id } = validate(TeamValidator.idParam, req.params);

    const data = await TeamService.listMembers(id);

    return ApiResponse.success({
      res,
      data,
      message: "Team members fetched successfully",
    });
  },

  addMember: async (req, res) => {
    const { id } = validate(TeamValidator.idParam, req.params);

    const body = validate(TeamValidator.addMember, req.body);

    const data = await TeamService.addMember(id, body.user_id, body.is_leader);

    return ApiResponse.success({
      res,
      data,
      message: "Member added to team successfully",
    });
  },

  removeMember: async (req, res) => {
    const { id, userId } = validate(TeamValidator.memberParam, req.params);

    const data = await TeamService.removeMember(id, userId);

    return ApiResponse.success({
      res,
      data,
      message: "Member removed from team successfully",
    });
  },

  setLeader: async (req, res) => {
    const { id } = validate(TeamValidator.idParam, req.params);

    const body = validate(TeamValidator.setLeader, req.body);

    const data = await TeamService.setLeader(id, body.user_id, body.is_leader);

    return ApiResponse.success({
      res,
      data,
      message: "Team leader updated successfully",
    });
  },

  listChildren: async (req, res) => {
    const { id } = validate(TeamValidator.idParam, req.params);

    const data = await TeamService.listChildren(id);

    return ApiResponse.success({
      res,
      data,
      message: "Child teams fetched successfully",
    });
  },

  getAssignableTeams: async (req, res) => {
    const tenantId = req.user.tenant_id;

    const data = await TeamService.getAssignableTeams(tenantId);

    return ApiResponse.success({
      res,
      data,
      message: "Assignable Team fetched successfully",
    });
  },
};
