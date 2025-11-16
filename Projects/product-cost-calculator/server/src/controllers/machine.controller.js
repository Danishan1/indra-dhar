import { MachineService } from "../services/machine.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const MachineController = {
  async create(req, res, next) {
    try {
      const machine = await MachineService.createMachine(req.body);
      return ApiResponse.success(res, machine, "Machine created successfully");
    } catch (err) {
      next(err);
    }
  },

  async getAll(req, res, next) {
    try {
      const machines = await MachineService.getAllMachines(req.query);
      return ApiResponse.success(res, machines);
    } catch (err) {
      next(err);
    }
  },

  async getOne(req, res, next) {
    try {
      const machine = await MachineService.getMachineById(req.params.id);
      return ApiResponse.success(res, machine);
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const machine = await MachineService.updateMachine(
        req.params.id,
        req.body
      );
      return ApiResponse.success(res, machine, "Machine updated successfully");
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      await MachineService.deleteMachine(req.params.id);
      return ApiResponse.success(res, null, "Machine deactivated successfully");
    } catch (err) {
      next(err);
    }
  },

  async bulkCreate(req, res, next) {
    try {
      const machines = await MachineService.createMachinesBulk(req.body);
      return ApiResponse.success(
        res,
        machines,
        "Machines inserted successfully"
      );
    } catch (err) {
      next(err);
    }
  },
};
