import { z } from "zod";

/**
 * Integration Types
 */
export const INTEGRATION_TYPE = {
  FACEBOOK: "FACEBOOK",
  INDIAMART: "INDIAMART",
  EMAIL: "EMAIL",
  WHATSAPP: "WHATSAPP",
  SMS: "SMS",
  API: "API",
};

/**
 * Categories
 */
export const INTEGRATION_CATEGORY = {
  INBOUND: "INBOUND",
  OUTBOUND: "OUTBOUND",
};

/**
 * CREATE INTEGRATION
 */
export const createIntegrationSchema = z.object({
  name: z.string().min(2).max(100),
  type: z.enum(["FACEBOOK", "INDIAMART", "EMAIL", "WHATSAPP", "SMS", "API"]),
  category: z.enum(["INBOUND", "OUTBOUND"]),
  provider: z.string().optional(),
  config: z.record(z.any()).default({}),
});

/**
 * UPDATE INTEGRATION
 */
export const updateIntegrationSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  provider: z.string().optional(),
  status: z.enum(["CONNECTED", "DISCONNECTED", "ERROR"]).optional(),
  config: z.record(z.any()).optional(),
});

/**
 * TEST CONNECTION
 */
export const testIntegrationSchema = z.object({
  payload: z.record(z.any()).optional(),
});
