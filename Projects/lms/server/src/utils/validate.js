import { ZodError } from "zod";

export function validate(schema, data) {
  try {
    return schema.parse(data);
  } catch (err) {
    if (err instanceof ZodError) {
      const errors = err.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));

      console.error("Validation errors:", errors);

      throw {
        status: 400,
        message: "Validation failed",
        errors,
      };
    }

    throw err;
  }
}
