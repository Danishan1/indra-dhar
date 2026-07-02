import { AuthService } from "../services/auth.service.js";

export const AuthController = {
  async login(req, res) {
    try {
      const { email, password, tenantId } = req.body;

      const result = await AuthService.login(email, password, tenantId, {
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      });

      res.json(result);
    } catch (err) {
      res.status(401).json({ message: err.message });
    }
  },

  async refresh(req, res) {
    try {
      const { refreshToken } = req.body;

      const result = await AuthService.refresh(refreshToken);

      res.json(result);
    } catch (err) {
      res.status(401).json({ message: err.message });
    }
  },

  async logout(req, res) {
    try {
      const { refreshToken } = req.body;

      await AuthService.logout(refreshToken);

      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  async forgotPassword(req, res) {
    try {
      const { email, tenantId } = req.body;

      await AuthService.forgotPassword(email, tenantId);

      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  async resetPassword(req, res) {
    try {
      const { token, password } = req.body;

      await AuthService.resetPassword(token, password);

      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  async me(req, res) {
    try {
      const userId = req.user.user_id;

      const user = await AuthService.me(userId);

      res.json(user);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  },
};
