import { createUser, findUserByEmail } from "../repositories/user.repository.js";
import { hashPassword, comparePassword } from "../utils/hash.util.js";
import { generateToken } from "../utils/token.util.js";

export const registerUser = async ({ name, email, password, role }) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) throw new Error("Email already registered");

  const password_hash = await hashPassword(password);
  const user = await createUser({ name, email, password_hash, role });

  const token = generateToken(user);
  return { user, token };
};

export const loginUser = async ({ email, password }) => {
  const user = await findUserByEmail(email);
  if (!user) throw new Error("Invalid credentials");

  const match = await comparePassword(password, user.password_hash);
  if (!match) throw new Error("Invalid credentials");

  const token = generateToken(user);
  return {
    user: {
      id: user.id,
      user_uuid: user.user_uuid,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};
