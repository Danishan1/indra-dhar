import { AuthService } from "../services/auth.service.js";

export const AuthController = {
  async login(req, res) {
    const { email, password, tenantCode } = req.body;

    const result = await AuthService.login(email, password, tenantCode, {
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      authenticated: true,
      accessToken: result.accessToken,
      user: result.user,
    });
  },

  async refresh(req, res) {
    const refreshToken = req.cookies?.refreshToken;

    const result = await AuthService.refresh(refreshToken);

    return res.json(result);
  },

  async logout(req, res) {
    const refreshToken = req.cookies.refreshToken;

    await AuthService.logout(refreshToken);

    res.clearCookie("refreshToken");

    return res.json({ success: true });
  },

  async forgotPassword(req, res) {
    const { email, tenantId } = req.body;

    await AuthService.forgotPassword(email, tenantId);

    res.json({ success: true });
  },

  async resetPassword(req, res) {
    const { token, password } = req.body;

    await AuthService.resetPassword(token, password);

    res.json({ success: true });
  },

  async me(req, res) {
    const userId = req.user.user_id;

    const user = await AuthService.me(userId);

    res.json(user);
  },
};
