import { ItemFormTemplate } from "../models/ItemFormTemplate.js";
import { Phase } from "../models/phase.js";
import { User } from "../models/user.js";

// ---- Phase Management ----
export const createPhase = async (req, res) => {
  try {
    const phase = new Phase(req.body);
    await phase.save();
    res.status(201).json(phase);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updatePhase = async (req, res) => {
  try {
    const phase = await Phase.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(phase);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deletePhase = async (req, res) => {
  try {
    await Phase.findByIdAndDelete(req.params.id);
    res.json({ message: "Phase deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ---- User Management ----
export const createUser = async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    const user = new User(rest);
    await user.setPassword(password);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, rest, {
      new: true,
    });
    if (password) {
      await user.setPassword(password);
      await user.save();
    }
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ---- Form Template Management ----
export const createFormTemplate = async (req, res) => {
  try {
    const form = new ItemFormTemplate(req.body);
    await form.save();
    res.status(201).json(form);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ---- Global Dashboard ----
export const getGlobalDashboard = async (req, res) => {
  try {
    const phases = await Phase.find().populate("users", "name email role");
    res.json({ phases });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
