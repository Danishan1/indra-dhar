import { UnitRepository } from "../repositories/unit.repository.js";
import { ApiError } from "../utils/ApiError.js";
import { sanitizeInput } from "../utils/sanitizeInput.js";

export const UnitService = {
  async createUnit(payload) {
    const data = sanitizeInput(payload);

    const existing = await UnitRepository.findByName(data.name);
    if (existing) throw new ApiError(409, "Unit already exists");

    return UnitRepository.create({
      name: data.name.trim(),
      unit_code: data.unit_code.trim(),
      // base_unit: data.base_unit.trim(),
      decimal_allowed: data.decimal_allowed ?? true,
    });
  },

  async bulkCreateUnits(payload = []) {
    if (!Array.isArray(payload) || !payload.length) {
      throw new ApiError(400, "Units array is required");
    }

    const sanitizedUnits = payload.map((unit) => {
      const data = sanitizeInput(unit);
      return {
        name: data.name.trim(),
        unit_code: data.unit_code.trim(),
        // base_unit: data.base_unit.trim(),
        decimal_allowed: data.decimal_allowed ?? true,
      };
    });

    return UnitRepository.bulkCreate(sanitizedUnits);
  },

  async getAllUnits() {
    return UnitRepository.findAll();
  },

  async getUnitById(id) {
    const unit = await UnitRepository.findById(id);
    if (!unit) throw new ApiError(404, "Unit not found");
    return unit;
  },

  async updateUnit(id, updates) {
    const sanitized = sanitizeInput(updates);

    const existing = await UnitRepository.findById(id);
    if (!existing) throw new ApiError(404, "Unit not found");

    if (sanitized.name && sanitized.name !== existing.name) {
      const duplicate = await UnitRepository.findByName(sanitized.name);
      if (duplicate) throw new ApiError(409, "Unit name already exists");
    }

    return UnitRepository.update(id, sanitized);
  },

  async deleteUnit(id) {
    const existing = await UnitRepository.findById(id);
    if (!existing) throw new ApiError(404, "Unit not found");
    return UnitRepository.delete(id);
  },
};
