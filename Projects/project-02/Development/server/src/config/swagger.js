import swaggerJSDoc from "swagger-jsdoc";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const docsPath = path.resolve("src/api-docs");
const PORT = process.env.PORT || 4000;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Workflow Management API",
      version: "1.0.0",
      description: "API documentation for Workflow Management System",
    },
    servers: [
      {
        url: `http://localhost:${PORT}/api`,
        description: "Local Dev Server",
      },
    ],
  },
  apis: [path.join(docsPath, "*.js"), `${__dirname}/../routes/*.js`], // Will read JSDoc from routes
};

export const swaggerSpec = swaggerJSDoc(options);
