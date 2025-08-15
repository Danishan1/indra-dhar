// seed.js
import { Tenant } from "../models/Tenant.js";
import { User } from "../models/User.js";
import { Phase } from "../models/Phase.js";
import { connectDB } from "../config/db.js";
import { Item } from "../models/Item.js";
import { ReturnRequest } from "../models/ReturnRequest.js";
import { ItemDetails } from "../models/ItemDetails.js";

async function seed() {
  try {
    connectDB();

    // Clear existing data (optional)
    await Promise.all([
      Tenant.deleteMany({}),
      Phase.deleteMany({}),
      User.deleteMany({}),
      Item.deleteMany({}),
      ReturnRequest.deleteMany({}),
      ItemDetails.deleteMany({}),
    ]);

    // Create Tenant
    const tenant = await Tenant.create({ name: "IndraDhar" });

    // Tanent Admin User

    const user = new User({
      name: `Admin User`,
      email: `admin@indradhar.com`,
      role: "admin",
      tenantId: tenant._id,
    });
    await user.setPassword("password123"); // default password
    await user.save();

    // Phase names in order
    const phaseNames = [
      { role: "kora", name: "Kora" },
      { role: "paint", name: "Paint" },
      { role: "finishing", name: "Finishing" },
      { role: "stock", name: "Stock" },
      { role: "dispach-ecommerce", name: "Export" },
      { role: "dispach-bulk", name: "E-commerce" },
    ];

    // Create Users (one for each phase)
    const users = [];
    for (let i = 0; i < phaseNames.length; i++) {
      const user = new User({
        name: `${phaseNames[i].name} Head`,
        email: `${phaseNames[i].name.toLowerCase()}@indradhar.com`,
        role: phaseNames[i].role,
        tenantId: tenant._id,
      });
      await user.setPassword("password123"); // default password
      await user.save();
      users.push(user);
    }

    // Create Phases and link users
    const phases = [];
    for (let i = 0; i < phaseNames.length; i++) {
      const phase = await Phase.create({
        tenantId: tenant._id,
        name: phaseNames[i].name,
        order: i + 1,
        users: [users[i]._id],
      });

      // Also link phase to user
      users[i].phases.push(phase._id);
      await users[i].save();

      phases.push(phase);
    }

    console.log("Seed completed successfully");
    console.log({
      tenant,
      phases: phases.map((p) => ({ name: p.name, order: p.order })),
      users: users.map((u) => ({ name: u.name, email: u.email })),
    });

    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seed();
