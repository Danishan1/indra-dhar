import { db } from "../config/db.js";

export const AuthRepository = {
  async findUserByEmail(email, tenantId) {
    return db.query("SELECT * FROM users WHERE email = $1 AND tenant_id = $2", [
      email,
      tenantId,
    ]);
  },

  async findUserById(userId) {
    return db.query("SELECT * FROM users WHERE id = $1", [userId]);
  },

  async updateLastLogin(userId) {
    return db.query("UPDATE users SET last_login = NOW() WHERE id = $1", [
      userId,
    ]);
  },

  async createSession(data) {
    return db.query(
      `INSERT INTO sessions (user_id, refresh_token, ip_address, user_agent, expires_at)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        data.user_id,
        data.refresh_token,
        data.ip_address,
        data.user_agent,
        data.expires_at,
      ],
    );
  },

  async revokeSession(token) {
    return db.query(
      "UPDATE sessions SET revoked_at = NOW() WHERE refresh_token = $1",
      [token],
    );
  },

  async findSession(token) {
    return db.query(
      "SELECT * FROM sessions WHERE refresh_token = $1 AND revoked_at IS NULL",
      [token],
    );
  },

  async createPasswordReset(userId, token, expiresAt) {
    return db.query(
      `INSERT INTO password_resets (user_id, token, expires_at)
       VALUES ($1, $2, $3)`,
      [userId, token, expiresAt],
    );
  },

  async findPasswordReset(token) {
    return db.query(
      "SELECT * FROM password_resets WHERE token = $1 AND used_at IS NULL",
      [token],
    );
  },

  async markPasswordResetUsed(token) {
    return db.query(
      "UPDATE password_resets SET used_at = NOW() WHERE token = $1",
      [token],
    );
  },

  async updatePassword(userId, hash) {
    return db.query("UPDATE users SET password_hash = $1 WHERE id = $2", [
      hash,
      userId,
    ]);
  },
};
