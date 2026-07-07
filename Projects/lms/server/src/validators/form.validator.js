import { z } from "zod";

export const formLeadSchema = z
  .object({
    name: z.string().min(2, "Name is required").optional(),
    email: z.string().email("Invalid email").optional(),
    phone: z.string().min(5, "Invalid phone number").optional(),
    message: z.string().optional(),
    company: z.string().optional(),
    product: z.string().optional(),

    // allow custom form fields
    metadata: z.record(z.any()).optional(),
  })
  .refine((data) => data.email || data.phone, {
    message: "Either email or phone is required",
  });
