import xss from "xss";

export const sanitizeInput = (input) => {
  if (typeof input === "string") return xss(input.trim());
  if (typeof input === "object") {
    const sanitized = {};
    for (const key in input) {
      sanitized[key] = sanitizeInput(input[key]);
    }
    return sanitized;
  }
  return input;
};
