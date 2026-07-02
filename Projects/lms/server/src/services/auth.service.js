import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { AuthRepository } from "../repositories/auth.repository.js";

export const AuthService = {
  async login(email, password, tenantId, meta) {
    const userRes = await AuthRepository.findUserByEmail(email, tenantId);

    const user = userRes.rows[0];
    if (!user) throw new Error("Invalid credentials");

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) throw new Error("Invalid credentials");

    const token = jwt.sign(
      { user_id: user.id, tenant_id: tenantId },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    await AuthRepository.createSession({
      user_id: user.id,
      refresh_token: token,
      ip_address: meta.ip,
      user_agent: meta.userAgent,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await AuthRepository.updateLastLogin(user.id);

    delete user.password_hash;

    return { token, user };
  },

  async refresh(refreshToken) {
    const sessionRes = await AuthRepository.findSession(refreshToken);

    const session = sessionRes.rows[0];
    if (!session) throw new Error("Invalid session");

    const payload = jwt.verify(refreshToken, process.env.JWT_SECRET);

    const newToken = jwt.sign(
      { user_id: payload.user_id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    return { token: newToken };
  },

  async logout(refreshToken) {
    await AuthRepository.revokeSession(refreshToken);
    return true;
  },

  async forgotPassword(email, tenantId) {
    const userRes = await AuthRepository.findUserByEmail(email, tenantId);

    const user = userRes.rows[0];
    if (!user) return true;

    const token = crypto.randomBytes(32).toString("hex");

    await AuthRepository.createPasswordReset(
      user.id,
      token,
      new Date(Date.now() + 60 * 60 * 1000),
    );

    console.log("RESET TOKEN:", token);

    return true;
  },

  async resetPassword(token, newPassword) {
    const resetRes = await AuthRepository.findPasswordReset(token);

    const reset = resetRes.rows[0];
    if (!reset) throw new Error("Invalid token");

    const hash = await bcrypt.hash(newPassword, 10);

    await AuthRepository.updatePassword(reset.user_id, hash);
    await AuthRepository.markPasswordResetUsed(token);

    return true;
  },

  async me(userId) {
    const userRes = await AuthRepository.findUserById(userId);

    const user = userRes.rows[0];
    if (!user) throw new Error("User not found");

    delete user.password_hash;

    return user;
  },
};
