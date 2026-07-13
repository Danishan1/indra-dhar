import bcrypt from "bcrypt";
import { UserRepository } from "../repositories/user.repository.js";

export const UserService = {
  async create(data) {
    const hash = await bcrypt.hash(data.password, 10);

    return UserRepository.create({
      ...data,
      password_hash: hash,
    });
  },

  async list(tenantId) {
    return UserRepository.list(tenantId);
  },

  async getById(id) {
    return UserRepository.findById(id);
  },

  async update(id, data) {
    return UserRepository.update(id, data);
  },

  async toggleStatus(id, isActive) {
    return UserRepository.updateStatus(id, isActive);
  },

  async assignTeam(userId, teamId, isLeader = false) {
    return UserRepository.assignTeam(userId, teamId, isLeader);
  },

  async removeFromTeam(userId, teamId) {
    return UserRepository.removeFromTeam(userId, teamId);
  },
};
