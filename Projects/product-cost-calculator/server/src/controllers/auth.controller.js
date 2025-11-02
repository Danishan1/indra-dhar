import jwt from "jsonwebtoken";
import { registerUser, loginUser } from "../services/auth.service.js";
export const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;
    const result = await registerUser({
      name,
      email,
      password,
      role,
      confirmPassword,
    });
    res.status(201).json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser({ email, password });
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const checkJwt = (req, res) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authorization header missing or malformed",
    });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({
      success: true,
      message: "Token is valid",
      user: decoded,
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired" });
    }
    console.log("Check JWT Error", error);
    return res.status(403).json({ success: false, message: "Invalid token" });
  }
};
