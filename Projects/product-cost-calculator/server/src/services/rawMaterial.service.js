import { RawMaterialRepository } from "../repositories/rawMaterial.repository.js";
import { UnitRepository } from "../repositories/unit.repository.js";
import { ApiError } from "../utils/ApiError.js";
import { sanitizeInput } from "../utils/sanitizeInput.js";

export const RawMaterialService = {
  async createMaterial(payload) {
    const data = sanitizeInput(payload);

    const unit = await UnitRepository.findById(data.unit_type_id);
    if (!unit) throw new ApiError(400, "Invalid unit type");

    return RawMaterialRepository.create({
      name: data.name.trim(),
      unit_type_id: data.unit_type_id,
      unit_price: parseFloat(data.unit_price),
      is_gst_itc: data.is_gst_itc ?? false,
      gst: parseFloat(data.gst || 0),
    });
  },

  async getAllMaterials(filters = {}) {
    return RawMaterialRepository.findAll(filters);
  },

  async getMaterialById(id) {
    const material = await RawMaterialRepository.findById(id);
    if (!material) throw new ApiError(404, "Raw material not found");
    return material;
  },

  async updateMaterial(id, updates) {
    const sanitized = sanitizeInput(updates);

    const existing = await RawMaterialRepository.findById(id);
    if (!existing) throw new ApiError(404, "Raw material not found");

    if (sanitized.unit_type_id) {
      const unit = await UnitRepository.findById(sanitized.unit_type_id);
      if (!unit) throw new ApiError(400, "Invalid unit type");
    }

    return RawMaterialRepository.update(id, sanitized);
  },

  async deleteMaterial(id) {
    const existing = await RawMaterialRepository.findById(id);
    if (!existing) throw new ApiError(404, "Raw material not found");
    return RawMaterialRepository.delete(id);
  },

  async createMaterialsBulk(payloads) {
    if (!Array.isArray(payloads) || !payloads.length) {
      throw new ApiError(400, "Payload must be a non-empty array");
    }

    const sanitized = [];

    for (const p of payloads) {
      const data = sanitizeInput(p);

      if (!data.name || !data.unit_type_id || isNaN(data.unit_price)) {
        throw new ApiError(400, "Invalid data in bulk insert");
      }

      const unit = await UnitRepository.findById(data.unit_type_id);
      if (!unit) throw new ApiError(400, "Invalid unit type");

      sanitized.push({
        name: data.name.trim(),
        unit_type_id: data.unit_type_id,
        unit_price: parseFloat(data.unit_price),
        is_gst_itc: data.is_gst_itc ?? false,
        gst: parseFloat(data.gst || 0),
      });
    }

    return RawMaterialRepository.createBulk(sanitized);
  },
};
