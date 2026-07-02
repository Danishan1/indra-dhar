import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CRM API",
      version: "1.0.0",
      description: "CRM backend API documentation",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
      },
    ],
  },

  apis: ["./src/routes/**/*.js"],
});
