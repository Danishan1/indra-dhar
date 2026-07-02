import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { pool } from "./src/config/db.js";

async function seed() {
  const client = await pool.connect();

  console.log("Connected to PostgreSQL for seeding...");

  try {
    // =====================================================
    // 1. TENANT
    // =====================================================
    const tenantId = randomUUID();

    await client.query(
      `
      INSERT INTO tenants (id, name, code, status)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (code) DO NOTHING
      `,
      [tenantId, "Default Tenant", "DEFAULT", "ACTIVE"],
    );

    console.log("Tenant seeded");

    // =====================================================
    // 2. ROLES
    // =====================================================
    const roles = [
      { name: "admin", system: true },
      { name: "manager", system: true },
      { name: "user", system: true },
    ];

    const roleIds = {};

    for (const role of roles) {
      const roleId = randomUUID();

      const res = await client.query(
        `
        INSERT INTO roles (id, tenant_id, name, system_role)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (tenant_id, name) DO NOTHING
        RETURNING id
        `,
        [roleId, tenantId, role.name, role.system],
      );

      // if already exists, fetch it
      if (res.rows.length > 0) {
        roleIds[role.name] = res.rows[0].id;
      } else {
        const existing = await client.query(
          `SELECT id FROM roles WHERE tenant_id = $1 AND name = $2`,
          [tenantId, role.name],
        );
        roleIds[role.name] = existing.rows[0].id;
      }
    }

    console.log("Roles seeded");

    // =====================================================
    // 3. USERS
    // =====================================================
    const users = [
      {
        first_name: "Admin",
        last_name: "User",
        email: "admin@example.com",
        password: "Password@123",
        role: "admin",
      },
      {
        first_name: "Project",
        last_name: "Manager",
        email: "manager@example.com",
        password: "Password@123",
        role: "manager",
      },
      {
        first_name: "Regular",
        last_name: "User",
        email: "user@example.com",
        password: "Password@123",
        role: "user",
      },
    ];

    const userIds = {};

    for (const user of users) {
      const userId = randomUUID();
      const passwordHash = await bcrypt.hash(user.password, 10);

      await client.query(
        `
        INSERT INTO users (
          id, tenant_id, role_id,
          first_name, last_name, email,
          password_hash
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        ON CONFLICT (tenant_id, email) DO NOTHING
        `,
        [
          userId,
          tenantId,
          roleIds[user.role],
          user.first_name,
          user.last_name,
          user.email,
          passwordHash,
        ],
      );

      const existing = await client.query(
        `SELECT id FROM users WHERE tenant_id = $1 AND email = $2`,
        [tenantId, user.email],
      );

      userIds[user.role] = existing.rows[0].id;

      console.log(`Seeded user: ${user.email}`);
    }

    // =====================================================
    // 4. TEAMS
    // =====================================================
    const teamId = randomUUID();

    await client.query(
      `
      INSERT INTO teams (id, tenant_id, name, manager_id)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (tenant_id, name) DO NOTHING
      `,
      [teamId, tenantId, "Core Team", userIds["manager"]],
    );

    console.log("Teams seeded");

    console.log("Seeding completed successfully!");
  } finally {
    client.release();
  }

  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
