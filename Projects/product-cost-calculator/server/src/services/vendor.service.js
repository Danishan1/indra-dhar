// import { VendorRepository } from "../repositories/vendor.repository.js";
// import { ApiError } from "../utils/ApiError.js";
// import { sanitizeInput } from "../utils/sanitizeInput.js";

// export const VendorService = {
//   async createVendor(payload) {
//     const data = sanitizeInput(payload);

//     // Simple validation for duplicate name or email (optional)
//     const vendors = await VendorRepository.findAll({ name: data.name });
//     if (vendors.length > 0) {
//       throw new ApiError(400, "Vendor with this name already exists");
//     }

//     return VendorRepository.create({
//       name: data.name.trim(),
//       contact_name: data.contact_name?.trim() || null,
//       email: data.email?.trim() || null,
//       phone: data.phone?.trim() || null,
//       address: data.address?.trim() || null,
//     });
//   },

//   async getAllVendors(filters = {}) {
//     return VendorRepository.findAll(filters);
//   },

//   async getVendorById(id) {
//     const vendor = await VendorRepository.findById(id);
//     if (!vendor) throw new ApiError(404, "Vendor not found");
//     return vendor;
//   },

//   async updateVendor(id, updates) {
//     const sanitized = sanitizeInput(updates);
//     const existing = await VendorRepository.findById(id);
//     if (!existing) throw new ApiError(404, "Vendor not found");

//     return VendorRepository.update(id, sanitized);
//   },

//   async deleteVendor(id) {
//     const existing = await VendorRepository.findById(id);
//     if (!existing) throw new ApiError(404, "Vendor not found");
//     return VendorRepository.delete(id);
//   },
// };
