import { SessionService } from "../services/session.service.js";

export const SessionController = {
  async list(req, res) {
    const userId = req.user.user_id;

    const sessions = await SessionService.list(userId);

    res.json(sessions);
  },

  async revoke(req, res) {
    const userId = req.user.user_id;
    const sessionId = req.params.id;

    await SessionService.revoke(sessionId, userId);

    res.json({ success: true });
  },

  async revokeAll(req, res) {
    const userId = req.user.user_id;

    await SessionService.revokeAll(userId);

    res.json({ success: true });
  },
};
