import { RawMaterialRepository } from "../repositories/rawMaterial.repository.js";
import { VendorRepository } from "../repositories/vendor.repository.js"; // assuming this exists
import { ApiError } from "../utils/ApiError.js";
import { sanitizeInput } from "../utils/sanitizeInput.js";

export const RawMaterialService = {
  async createMaterial(payload) {
    const data = sanitizeInput(payload);

    // Validate vendor if provided
    if (data.vendor_id) {
      const vendor = await VendorRepository.findById(data.vendor_id);
      if (!vendor) throw new ApiError(400, "Invalid vendor ID");
    }

    return RawMaterialRepository.create({
      name: data.name.trim(),
      unit_type: data.unit_type.trim(),
      unit_price: parseFloat(data.unit_price),
      stock_quantity: parseFloat(data.stock_quantity || 0),
      reorder_level: parseFloat(data.reorder_level || 0),
      vendor_id: data.vendor_id || null,
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

    if (sanitized.vendor_id) {
      const vendor = await VendorRepository.findById(sanitized.vendor_id);
      if (!vendor) throw new ApiError(400, "Invalid vendor ID");
    }

    return RawMaterialRepository.update(id, sanitized);
  },

  async deleteMaterial(id) {
    const existing = await RawMaterialRepository.findById(id);
    if (!existing) throw new ApiError(404, "Raw material not found");
    return RawMaterialRepository.delete(id);
  },
};
