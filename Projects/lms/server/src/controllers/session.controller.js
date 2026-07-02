import { SessionService } from "../services/session.service.js";

export const SessionController = {
  async list(req, res) {
    try {
      const userId = req.user.user_id;

      const sessions = await SessionService.list(userId);

      res.json(sessions);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async revoke(req, res) {
    try {
      const userId = req.user.user_id;
      const sessionId = req.params.id;

      await SessionService.revoke(sessionId, userId);

      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  async revokeAll(req, res) {
    try {
      const userId = req.user.user_id;

      await SessionService.revokeAll(userId);

      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
};
