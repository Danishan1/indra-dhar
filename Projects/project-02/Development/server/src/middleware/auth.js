import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const { verify } = jwt;

export async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verify(token, process.env.JWT_SECRET);

    // attach user minimal info
    const user = await User.findById(payload.userId).select("-passwordHash");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = {
      userId: payload.userId,
      tenantId: payload.tenantId,
      role: payload.role,
      name: payload.name,
      email: payload.email,
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
