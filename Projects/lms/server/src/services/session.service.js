import { SessionRepository } from "../repositories/session.repository.js";

export const SessionService = {
  async list(userId) {
    const res = await SessionRepository.listByUser(userId);
    return res.rows;
  },

  async revoke(sessionId, userId) {
    const res = await SessionRepository.findById(sessionId);

    const session = res.rows[0];
    if (!session) throw new Error("Session not found");

    if (session.user_id !== userId) {
      throw new Error("Forbidden");
    }

    await SessionRepository.revokeById(sessionId);

    return true;
  },

  async revokeAll(userId) {
    await SessionRepository.revokeAllByUser(userId);
    return true;
  },
};
