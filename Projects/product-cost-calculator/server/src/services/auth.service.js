import {
  createUser,
  findUserByEmail,
} from "../repositories/auth.repository.js";
import { hashPassword, comparePassword } from "../utils/hash.util.js";
import { generateToken } from "../utils/token.util.js";

export const registerUser = async ({
  name,
  email,
  password,
  confirmPassword,
  role,
}) => {
  // Validate input fields
  if (!name || !email || !password || !confirmPassword) {
    throw new Error("All fields are required");
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  // Validate password strength (optional but recommended)
  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters long");
  }

  // Check if email already exists
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error("Email already registered");
  }

  // Hash password securely
  const password_hash = await hashPassword(password);

  // Create user record
  const user = await createUser({ name, email, password_hash, role });

  // Generate authentication token
  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  // Return response without sensitive info
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
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
