/**
 * Main Application
 * Express app configuration and middleware setup
 */

import express, { Express, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";
import userRoutes from "./modules/user/user.routes";

// Create an instance of the Express application
const app: Express = express();

// --------------- Middleware ---------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --------------- Swagger Docs ---------------
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --------------- Health Check ---------------
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// --------------- API Routes ---------------
app.use("/api/users", userRoutes);

export default app;
