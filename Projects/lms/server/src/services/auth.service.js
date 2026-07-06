import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { AuthRepository } from "../repositories/auth.repository.js";
import { TenantRepository } from "../repositories/tenant.repository.js";

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

export const AuthService = {
  async login(email, password, tenantCode, meta) {
    const tenantId = await TenantRepository.findIdByCode(tenantCode);

    if (!tenantId) {
      throw new Error("Tenant not found");
    }

    const userRes = await AuthRepository.findUserByEmail(email, tenantId);
    const user = userRes.rows[0];

    if (!user) throw new Error("Invalid credentials");
    if (!user.is_active) throw new Error("Account disabled");

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) throw new Error("Invalid credentials");

    const accessToken = jwt.sign(
      { user_id: user.id, tenant_id: tenantId },
      process.env.JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY },
    );

    const refreshToken = jwt.sign(
      { user_id: user.id, tenant_id: tenantId },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY },
    );

    await AuthRepository.createSession({
      user_id: user.id,
      refresh_token: refreshToken,
      ip_address: meta.ip,
      user_agent: meta.userAgent,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    await AuthRepository.updateLastLogin(user.id);

    const userDataRes = await AuthRepository.getUserDetailed(user.id);
    const userData = userDataRes.rows[0];

    return {
      success: true,
      authenticated: true,
      accessToken,
      refreshToken,
      user: userData,
    };
  },

  async refresh(refreshToken) {
    if (!refreshToken) throw new Error("Unauthorized");

    const sessionRes = await AuthRepository.findSession(refreshToken);
    const session = sessionRes.rows[0];

    if (!session) throw new Error("Session expired");

    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const userRes = await AuthRepository.getUserDetailed(payload.user_id);
    const user = userRes.rows[0];

    if (!user || !user.is_active) throw new Error("Unauthorized");

    const accessToken = jwt.sign(
      { user_id: user.id, tenant_id: user.tenant.id }, // FIXED
      process.env.JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY },
    );

    return {
      success: true,
      authenticated: true,
      accessToken,
      user,
    };
  },

  async logout(refreshToken) {
    await AuthRepository.revokeSession(refreshToken);
    return true;
  },

  async me(userId) {
    const userRes = await AuthRepository.getUserDetailed(userId);
    const user = userRes.rows[0];

    if (!user) throw new Error("User not found");

    return user;
  },
};
