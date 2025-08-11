import mongoose from "mongoose";
import { ItemFormTemplate } from "../models/ItemFormTemplate.js";
import { Phase } from "../models/Phase.js";
import { User } from "../models/User.js";

// ---- Phase Management ----
export const createPhase = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { name, order, users, description } = req.body;

    // Check if phase name exists (case-insensitive)
    const nameExists = await Phase.findOne({
      tenantId,
      name: { $regex: `^${name}$`, $options: "i" },
    });

    if (nameExists) {
      return res.status(400).json({
        error: `Phase name "${name}" already exists. Please choose a different name.`,
      });
    }

    // Check if phase order exists
    const orderExists = await Phase.findOne({
      tenantId,
      order,
    });

    if (orderExists) {
      return res.status(400).json({
        error: `Phase order "${order}" already exists. Please choose a different order.`,
      });
    }

    const phase = new Phase({
      tenantId,
      name,
      order,
      users,
      description,
    });

    await phase.save();

    res.status(201).json({
      data: {},
      message: `${phase.name} created successfully.`,
    });
  } catch (err) {
    console.error("Error creating phase:", err);
    res.status(500).json({ error: "Internal server error" });
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

export const getPhasesByTenant = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { phaseId } = req.params; // optional

    if (!mongoose.Types.ObjectId.isValid(tenantId)) {
      return res.status(400).json({ error: "Invalid tenantId" });
    }

    if (phaseId) {
      if (!mongoose.Types.ObjectId.isValid(phaseId)) {
        return res.status(400).json({ error: "Invalid phaseId" });
      }

      const phase = await Phase.findOne({ _id: phaseId, tenantId }).populate(
        "users",
        "name email"
      );

      if (!phase) {
        return res.status(404).json({ error: "Phase not found" });
      }

      return res.status(200).json({
        label: phase.name,
        value: phase._id,
        order: phase.order,
        users: phase.users,
        description: phase.description || "Description not provided",
      });
    }

    const phases = await Phase.find({ tenantId })
      .populate("users", "name email")
      .sort({ order: 1, createdAt: -1 });

    const data = phases.map((phase) => ({
      label: phase.name,
      value: phase._id,
      order: phase.order,
      users: phase.users,
      description: phase.description,
    }));

    res.status(200).json({ data });
  } catch (err) {
    console.error("Error fetching phases:", err);
    res.status(500).json({ error: err.message });
  }
};

// ---- User Management ----
export const createUser = async (req, res) => {
  try {
    const { tenantId } = req.user;
    if (!mongoose.Types.ObjectId.isValid(tenantId)) {
      return res.status(400).json({ error: "Invalid tenantId" });
    }

    const { password, ...rest } = req.body;

    const user = new User({
      ...rest,
      tenantId,
    });

    await user.setPassword(password);
    await user.save();

    res.status(201).json({
      data: {},
      message: `${user.name} created successfully.`,
    });
  } catch (err) {
    console.error("Error creating user:", err);
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
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const deletedUser = await User.findOneAndDelete({ email });

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: `User with email ${email} deleted successfully.` });
  } catch (err) {
    console.error("Error deleting user:", err);
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

export const listUsers = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const format = req.query.format; // 'dropdown' or 'full'

    if (format === "dropdown") {
      // Minimal data for dropdown
      const users = await User.find({ tenantId })
        .select("name") // Only what's needed
        .lean();

      const formattedUsers = users.map((user) => ({
        label: user.name,
        value: user._id,
      }));

      return res.json(formattedUsers);
    }

    // Full detail mode
    const users = await User.find({ tenantId })
      .select("name email role phases")
      .populate("phases", "name")
      .lean();

    const formattedUsers = users.map((user) => ({
      name: user.name,
      email: user.email,
      role: user.role,
      phases: user.phases.map((phase) => ({
        phaseId: phase._id,
        phaseName: phase.name,
      })),
    }));

    res.json({ data: formattedUsers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ email }).populate("phases", "_id name");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const formattedUser = {
      name: user.name,
      email: user.email,
      role: user.role,
      phases: user.phases.map((phase) => ({
        phaseId: phase._id,
        phaseName: phase.name,
      })),
    };

    res.json({ data: formattedUser });
  } catch (err) {
    console.error("Error fetching user by email:", err);
    res.status(400).json({ error: err.message });
  }
};
