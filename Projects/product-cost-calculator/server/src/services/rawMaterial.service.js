import { RawMaterialRepository } from "../repositories/rawMaterial.repository.js";
import { ApiError } from "../utils/ApiError.js";
import { sanitizeInput } from "../utils/sanitizeInput.js";

export const RawMaterialService = {
  async createMaterial(payload) {
    const data = sanitizeInput(payload);

    return RawMaterialRepository.create({
      name: data.name.trim(),
      unit_type: data.unit_type.trim(),
      unit_price: parseFloat(data.unit_price),
      gst: parseFloat(data.gst),
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

    return RawMaterialRepository.update(id, sanitized);
  },

  async deleteMaterial(id) {
    const existing = await RawMaterialRepository.findById(id);
    if (!existing) throw new ApiError(404, "Raw material not found");
    return RawMaterialRepository.delete(id);
  },

  async createMaterialsBulk(payloads) {
    if (!Array.isArray(payloads) || payloads.length === 0)
      throw new Error("Payload must be a non-empty array");

    const sanitizedData = payloads.map((p) => {
      const data = sanitizeInput(p);
      if (!data.name || !data.unit_type || isNaN(parseFloat(data.unit_price))) {
        throw new Error("Invalid data in bulk insert");
      }

      return {
        name: data.name.trim(),
        unit_type: data.unit_type.trim(),
        unit_price: parseFloat(data.unit_price),
      };
    });

    return RawMaterialRepository.createBulk(sanitizedData);
  },
};
