import { hash, compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { Tenant } from "../models/Tenant.js";
import { registerSchema, loginSchema } from "../validations/auth.validation.js";

const SALT_ROUNDS = 10;

export async function register(req, res, next) {
  try {
    const { tenantName, name, email, password, role, phaseId } = req.body;

    // Validate
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    // Check if tenant exists, else create
    let tenant = await Tenant.findOne({ name: tenantName });
    if (!tenant) {
      tenant = await Tenant.create({ name: tenantName });
    }

    // Check if email already exists for this tenant
    const existingUser = await User.findOne({ tenantId: tenant._id, email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const passwordHash = await hash(password, SALT_ROUNDS);

    const user = await User.create({
      tenantId: tenant._id,
      name,
      email,
      passwordHash,
      role,
      phases: phaseId ? [phaseId] : [],
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: { userId: user._id, tenantId: tenant._id },
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { tenantName, email, password } = req.body;

    // Validate
    const { error } = loginSchema.validate({ tenantName, email, password });
    if (error) return res.status(400).json({ message: error.message });

    const tenant = await Tenant.findOne({ name: tenantName });
    if (!tenant) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = await User.findOne({ tenantId: tenant._id, email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const ok = await compare(password, user.passwordHash);
    if (!ok) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, tenantId: tenant._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
}
