import { Router } from "express";
const router = Router();
import { register, login } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/auth.js";

router.post("/register", register);
router.post("/login", login);
router.get("/verify", authMiddleware, (req, res) => {
  res.json({ message: "Token valid", user: req.user });
});

export const authRoutes = router;
