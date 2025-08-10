import { hash, compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Tenant from "../models/Tenant.js";

const { sign } = jwt;

const SALT_ROUNDS = 10;

export async function register(req, res, next) {
  try {
    const { tenantName, username, password, role, phaseId } = req.body;

    let tenant = await Tenant.findOne({ name: tenantName });
    if (!tenant) {
      tenant = await Tenant.create({ name: tenantName });
    }

    const passwordHash = await hash(password, SALT_ROUNDS);

    const user = await User.create({
      tenantId: tenant._id,
      username,
      passwordHash,
      role,
      phaseId: phaseId || null,
    });

    res.status(201).json({ userId: user._id, tenantId: tenant._id });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { tenantName, username, password } = req.body;

    const tenant = await Tenant.findOne({ name: tenantName });
    if (!tenant) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = await User.findOne({ tenantId: tenant._id, username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const ok = await compare(password, user.passwordHash);
    if (!ok) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = sign(
      { userId: user._id, tenantId: tenant._id },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      token,
      user: { id: user._id, username: user.username, role: user.role },
    });
  } catch (err) {
    next(err);
  }
}
