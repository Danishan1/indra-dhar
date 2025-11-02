import { MachineRepository } from "../repositories/machine.repository.js";
import { ApiError } from "../utils/ApiError.js";
import { sanitizeInput } from "../utils/sanitizeInput.js";

export const MachineService = {
  async createMachine(payload) {
    const data = sanitizeInput(payload);

    if (!data.name) throw new ApiError(400, "Machine name is required");
    if (isNaN(parseFloat(data.cost_per_hour))) {
      throw new ApiError(400, "Invalid cost per hour");
    }

    return MachineRepository.create({
      name: data.name.trim(),
      cost_per_hour: parseFloat(data.cost_per_hour),
      maintenance_cost: parseFloat(data.maintenance_cost || 0),
    });
  },

  async getAllMachines(filters = {}) {
    return MachineRepository.findAll(filters);
  },

  async getMachineById(id) {
    const machine = await MachineRepository.findById(id);
    if (!machine) throw new ApiError(404, "Machine not found");
    return machine;
  },

  async updateMachine(id, updates) {
    const sanitized = sanitizeInput(updates);
    const existing = await MachineRepository.findById(id);
    if (!existing) throw new ApiError(404, "Machine not found");

    return MachineRepository.update(id, sanitized);
  },

  async deleteMachine(id) {
    const existing = await MachineRepository.findById(id);
    if (!existing) throw new ApiError(404, "Machine not found");
    return MachineRepository.delete(id);
  },
};
