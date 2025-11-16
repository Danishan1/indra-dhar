import { UtilityRepository } from "../repositories/utility.repository.js";
import { ApiError } from "../utils/ApiError.js";
import { sanitizeInput } from "../utils/sanitizeInput.js";

export const UtilityService = {
  async createUtility(payload) {
    const data = sanitizeInput(payload);

    if (!data.name) throw new ApiError(400, "Utility name is required");
    if (!data.unit_type) throw new ApiError(400, "Unit type is required");
    if (isNaN(parseFloat(data.cost_per_unit)))
      throw new ApiError(400, "Invalid cost per unit");

    return UtilityRepository.create({
      name: data.name.trim(),
      unit_type: data.unit_type.trim(),
      cost_per_unit: parseFloat(data.cost_per_unit),
    });
  },

  async getAllUtilities(filters = {}) {
    return UtilityRepository.findAll(filters);
  },

  async getUtilityById(id) {
    const utility = await UtilityRepository.findById(id);
    if (!utility) throw new ApiError(404, "Utility not found");
    return utility;
  },

  async updateUtility(id, updates) {
    const sanitized = sanitizeInput(updates);
    const existing = await UtilityRepository.findById(id);
    if (!existing) throw new ApiError(404, "Utility not found");
    return UtilityRepository.update(id, sanitized);
  },

  async deleteUtility(id) {
    const existing = await UtilityRepository.findById(id);
    if (!existing) throw new ApiError(404, "Utility not found");
    return UtilityRepository.delete(id);
  },

  async createUtilitiesBulk(payloads) {
    if (!Array.isArray(payloads) || payloads.length === 0) {
      throw new ApiError(400, "Payload must be a non-empty array");
    }

    const utilitiesToInsert = payloads.map((u) => {
      const data = sanitizeInput(u);

      if (
        !data.name ||
        !data.unit_type ||
        isNaN(parseFloat(data.cost_per_unit))
      ) {
        throw new ApiError(400, "Invalid utility data");
      }

      return {
        name: data.name.trim(),
        unit_type: data.unit_type.trim(),
        cost_per_unit: parseFloat(data.cost_per_unit),
      };
    });

    return UtilityRepository.createBulk(utilitiesToInsert);
  },
};
