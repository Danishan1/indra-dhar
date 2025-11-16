import { UserService } from "../services/user.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const UserController = {
  async create(req, res, next) {
    try {
      const user = await UserService.createUser(req.body, req.user);
      return ApiResponse.success(res, user, "User created successfully");
    } catch (err) {
      console.error("DDDD", err);

      next(err);
    }
  },

  async getAll(req, res, next) {
    try {
      const users = await UserService.getAllUsers(req.query, req.user);
      return ApiResponse.success(res, users);
    } catch (err) {
      next(err);
    }
  },

  async getOne(req, res, next) {
    try {
      const user = await UserService.getUserById(req.params.id, req.user);
      return ApiResponse.success(res, user);
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const user = await UserService.updateUser(
        req.params.id,
        req.body,
        req.user
      );
      return ApiResponse.success(res, user, "User updated successfully");
    } catch (err) {
      next(err);
    }
  },

  async updatePassword(req, res, next) {
    try {
      const user = await UserService.updatePassword(
        req.params.id,
        req.body.password,
        req.user
      );
      return ApiResponse.success(res, user, "Password updated successfully");
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      await UserService.deactivateUser(req.params.id, req.user);
      return ApiResponse.success(res, null, "User deactivated successfully");
    } catch (err) {
      next(err);
    }
  },
};
