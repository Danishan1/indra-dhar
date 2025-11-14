import { ProjectCostRepository } from "../repositories/projectCost.repository.js";
import { ApiError } from "../utils/ApiError.js";
import { CostCalculationService } from "./costCalculation.service.js";

export const ProjectCostService = {
  async createProjectWithHistory(payload) {
    const data = payload.data || [];
    const meta = payload.meta || [];

    if (!meta.project_name) throw new ApiError(400, "Project name is required");

    if (!Array.isArray(data) || data.length === 0)
      throw new ApiError(400, "Resource items are required");

    // Calculate final cost
    const total_cost = await CostCalculationService.calculate(payload);

    // Insert project
    const project = await ProjectCostRepository.createProject({
      project_name: meta.project_name,
      total_cost: total_cost.finalCost.slice(1),
    });

    // Insert related inputs
    await ProjectCostRepository.addProjectItems(project.id, data);

    return { ...project, total_cost };
  },

  async getProjectHistory(id) {
    const project = await ProjectCostRepository.findProjectWithItems(id);
    if (!project) throw new ApiError(404, "Project history not found");

    return project;
  },

  async getAllProjects() {
    return ProjectCostRepository.findAllProjects();
  },
};
