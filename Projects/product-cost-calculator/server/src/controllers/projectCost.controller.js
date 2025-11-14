import { ProjectCostService } from "../services/projectCost.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const ProjectCostController = {
  async create(req, res, next) {
    try {
      const result = await ProjectCostService.createProjectWithHistory(
        req.body
      );
      return ApiResponse.success(
        res,
        result,
        "Project cost saved successfully"
      );
    } catch (err) {
      next(err);
    }
  },

  async getOne(req, res, next) {
    try {
      const project = await ProjectCostService.getProjectHistory(req.params.id);
      return ApiResponse.success(res, project);
    } catch (err) {
      next(err);
    }
  },

  async getAll(req, res, next) {
    try {
      const projects = await ProjectCostService.getAllProjects();
      return ApiResponse.success(res, projects);
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      await ProjectCostService.deleteProject(req.params.id);
      return ApiResponse.success(res, null, "Project deleted successfully");
    } catch (err) {
      next(err);
    }
  },
};

/*

//  // CREATE

{
  "project_name": "Office Table",
  "items": [
    {
      "resource_type": "/machines",
      "data": { "resource_id": 2, "resource_name": "Computer", "hours": 30 }
    },
    {
      "resource_type": "/raw-material",
      "data": { "resource_id": 1, "resource_name": "Wood", "quantity": 50 }
    }
  ]
}



*/

/*
//  // GET ALL

{
  "id": 15,
  "project_uuid": "37e5f7a2-99ce-4df0-aa92-54a43d527c45",
  "project_name": "Office Table",
  "total_cost": 4870.50,
  "created_at": "2025-11-14T09:51:33.000Z",
  "items": [
    {
      "resource_type": "/machines",
      "resource_id": 2,
      "resource_name": "Computer",
      "data": { "resource_id": 2, "resource_name": "Computer", "hours": 30 }
    },
    {
      "resource_type": "/raw-material",
      "resource_id": 1,
      "resource_name": "Wood",
      "data": { "resource_id": 1, "resource_name": "Wood", "quantity": 50 }
    }
  ]
}


*/
