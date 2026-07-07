import { db } from "../config/db.js";
import { dbResponse } from "../utils/dbResponse.js";
import { mapIntegrationConfig } from "../utils/integrationConfig.js";
import { INTEGRATION_TYPE } from "../validators/integration.validator.js";

export const IntegrationRepository = {
  async create(data) {
    const result = await db.query(
      `
      INSERT INTO integrations
      (
        tenant_id,
        name,
        type,
        category,
        provider,
        config,
        status
      )
      VALUES ($1,$2,$3,$4,$5,$6,'CONNECTED')
      RETURNING *
      `,
      [
        data.tenant_id,
        data.name,
        data.type,
        data.category,
        data.provider || null,
        JSON.stringify(data.config || {}),
      ],
    );

    return dbResponse.single(result);
  },

  async findAll(tenant_id) {
    const result = await db.query(
      `
      SELECT *
      FROM integrations
      WHERE tenant_id = $1
      ORDER BY created_at DESC
      `,
      [tenant_id],
    );

    return dbResponse.many(result);
  },

  async findById(id, tenant_id) {
    const result = await db.query(
      `
      SELECT *
      FROM integrations
      WHERE id = $1
      AND tenant_id = $2
      `,
      [id, tenant_id],
    );

    return dbResponse.single(result);
  },

  async update(id, tenant_id, data) {
    const result = await db.query(
      `
      UPDATE integrations
      SET
        name = COALESCE($3, name),
        provider = COALESCE($4, provider),
        status = COALESCE($5, status),
        config = COALESCE($6, config),
        updated_at = NOW()
      WHERE id = $1
      AND tenant_id = $2
      RETURNING *
      `,
      [
        id,
        tenant_id,
        data.name,
        data.provider,
        data.status,
        data.config ? JSON.stringify(data.config) : null,
      ],
    );

    return dbResponse.single(result);
  },

  async delete(id, tenant_id) {
    const result = await db.query(
      `
      DELETE FROM integrations
      WHERE id = $1
      AND tenant_id = $2
      RETURNING id
      `,
      [id, tenant_id],
    );

    return dbResponse.single(result);
  },

  async findByType(tenant_id, type) {
    const result = await db.query(
      `
      SELECT *
      FROM integrations
      WHERE tenant_id = $1
      AND type = $2
      AND status = 'CONNECTED'
      LIMIT 1
      `,
      [tenant_id, type],
    );

    const integration = dbResponse.single(result);

    if (!integration) {
      return null;
    }

    return {
      id: integration.id,
      tenant_id: integration.tenant_id,
      type: integration.type,
      provider: integration.provider,
      status: integration.status,

      config: mapIntegrationConfig(integration.type, integration.config),
    };
  },

  async findFacebookByVerifyToken(verifyToken) {
    const result = await db.query(
      `
      SELECT *
      FROM integrations
      WHERE type = $1
      AND config->>'verify_token' = $2
      AND status = 'CONNECTED'
      LIMIT 1
      `,
      [INTEGRATION_TYPE.FACEBOOK, verifyToken],
    );

    const integration = dbResponse.single(result);

    if (!integration) {
      return null;
    }

    return {
      id: integration.id,
      tenant_id: integration.tenant_id,
      type: integration.type,

      config: mapIntegrationConfig(integration.type, integration.config),
    };
  },

  async findFacebookByPageId(pageId) {
    const result = await db.query(
      `
      SELECT *
      FROM integrations
      WHERE type = $1
      AND config->>'page_id' = $2
      AND status = 'CONNECTED'
      LIMIT 1
      `,
      [INTEGRATION_TYPE.FACEBOOK, pageId],
    );

    const integration = dbResponse.single(result);

    if (!integration) {
      return null;
    }

    return {
      id: integration.id,
      tenant_id: integration.tenant_id,
      type: integration.type,

      config: mapIntegrationConfig(integration.type, integration.config),
    };
  },

  async findByWebhookToken(type, token) {
    const result = await db.query(
      `
      SELECT *
      FROM integrations
      WHERE type = $1
      AND config->>'webhook_token' = $2
      AND status = 'CONNECTED'
      LIMIT 1
      `,
      [type, token],
    );

    const integration = dbResponse.single(result);

    if (!integration) {
      return null;
    }

    return {
      id: integration.id,
      tenant_id: integration.tenant_id,
      type: integration.type,

      config: mapIntegrationConfig(integration.type, integration.config),
    };
  },

  async findByApiToken(type, token) {
    const result = await db.query(
      `
      SELECT *
      FROM integrations
      WHERE type = $1
      AND config->>'api_token' = $2
      AND status = 'CONNECTED'
      LIMIT 1
      `,
      [type, token],
    );

    const integration = dbResponse.single(result);

    if (!integration) {
      return null;
    }

    return {
      id: integration.id,
      tenant_id: integration.tenant_id,
      type: integration.type,

      config: mapIntegrationConfig(integration.type, integration.config),
    };
  },
};
