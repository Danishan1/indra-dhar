import { ProjectCostRepository } from "../repositories/projectCost.repository.js";
import { ApiError } from "../utils/ApiError.js";
import { sanitizeInput } from "../utils/sanitizeInput.js";
import { CostCalculationService } from "./costCalculation.service.js";

export const ProjectCostService = {
  async createProjectWithHistory(payload) {
    const data = sanitizeInput(payload);

    if (!data.project_name) throw new ApiError(400, "Project name is required");

    if (!Array.isArray(data.items) || data.items.length === 0)
      throw new ApiError(400, "Resource items are required");

    // Calculate final cost
    const total_cost = await CostCalculationService.calculate(data.items);

    // Insert project
    const project = await ProjectCostRepository.createProject({
      project_name: data.project_name,
      total_cost,
    });

    // Insert related inputs
    await ProjectCostRepository.addProjectItems(project.id, data.items);

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
