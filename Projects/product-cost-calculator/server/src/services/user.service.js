import { UserRepository } from "../repositories/user.repository.js";
import { ApiError } from "../utils/ApiError.js";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { sanitizeInput } from "../utils/sanitizeInput.js";

export const UserService = {
  // Used in registration or admin create
  async createUser(payload, currentUser = null) {
    const data = sanitizeInput(payload);

    // Check role permissions (admins > managers > users)
    if (currentUser) {
      if (currentUser.role === "manager" && data.role === "admin") {
        throw new ApiError(403, "Managers cannot create admin users");
      }
      if (currentUser.role === "user") {
        throw new ApiError(403, "Users cannot create other users");
      }
    }

    const existing = await UserRepository.findByEmail(data.email);
    if (existing) throw new ApiError(400, "Email already registered");

    const isSame = data.password === data.repassword;
    if (!isSame) throw new ApiError(400, "Password & Repassword do not match");

    const hash = await bcrypt.hash(data.password, 10);

    return UserRepository.create({
      user_uuid: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: hash,
      role: data.role || "user",
      status: "active",
    });
  },

  async getAllUsers(filters = {}, currentUser) {
    if (currentUser.role === "manager") {
      filters.role = "user"; // Managers can only view users
    }
    return UserRepository.findAll(filters);
  },

  async getUserById(id, currentUser) {
    const user = await UserRepository.findById(id);
    if (!user) throw new ApiError(404, "User not found");

    if (currentUser.role === "manager" && user.role === "admin") {
      throw new ApiError(403, "Not authorized to view this user");
    }

    return user;
  },

  async updateUser(id, updates, currentUser) {
    const existing = await UserRepository.findById(id);
    if (!existing) throw new ApiError(404, "User not found");

    // Role restrictions
    if (currentUser.role === "manager" && existing.role === "admin") {
      throw new ApiError(403, "Managers cannot modify admin users");
    }

    const sanitized = sanitizeInput(updates);
    delete sanitized.password; // password update handled separately

    return UserRepository.update(id, sanitized);
  },

  async updatePassword(id, newPassword, currentUser) {
    const existing = await UserRepository.findById(id);
    if (!existing) throw new ApiError(404, "User not found");

    if (currentUser.role === "manager" && existing.role === "admin") {
      throw new ApiError(403, "Not authorized to update admin password");
    }

    const hash = await bcrypt.hash(newPassword, 10);
    return UserRepository.update(id, { password_hash: hash });
  },

  async deactivateUser(id, currentUser) {
    const existing = await UserRepository.findById(id);
    if (!existing) throw new ApiError(404, "User not found");

    if (currentUser.role === "manager" && existing.role === "admin") {
      throw new ApiError(403, "Not authorized to deactivate admin users");
    }

    return UserRepository.softDelete(id);
  },
};
