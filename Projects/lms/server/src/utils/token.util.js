import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      uuid: user.user_uuid,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || "1d" }
  );
};
