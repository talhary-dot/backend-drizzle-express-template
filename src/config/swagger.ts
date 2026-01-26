import swaggerJsdoc, { type Options } from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { config } from "./env.ts";

const options: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Backend API",
      version: "1.0.0",
      description: "API Documentation for the Backend Template",
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
        description: "Local server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.ts", "./src/models/*.ts"], // Path to the API docs
};

const specs = swaggerJsdoc(options);

export const swaggerDocs = (app: any, port: number | string) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
};
