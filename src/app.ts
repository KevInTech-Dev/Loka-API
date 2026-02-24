import express, { Express, Request, Response } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import env from "@config/env";
import userRoute from "@modules/users/user.route";
import abonnementRoute from "@modules/abonnements/abonnement.route";
import swaggerSpec from "@/swagger";
import landLordRoute from "@/modules/landLord/landLord.route";
import propertyRoute from "@/modules/property/property.route";
import propertyTypeRoute from "@/modules/propertyType/propertyType.route";
import errorHandler, {
  notFoundHandler,
} from "@/modules/middleware/error.middleware";

const app: Express = express();
const API_PREFIX = env.API_PREFIX;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

//cors origin
app.use(cors());

// Swagger UI setup
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Rental Management API Documentation",
  }),
);

app.get("/api-docs.json", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Health check
app.get(`${API_PREFIX}/health`, (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: env.NODE_ENV,
  });
});

app.use(`${API_PREFIX}/users`, userRoute);
app.use(`${API_PREFIX}/property`, propertyRoute);
app.use(`${API_PREFIX}/property-type`, propertyTypeRoute);
app.use(`${API_PREFIX}/abonnements`, abonnementRoute);
app.use(`${API_PREFIX}/landLords`, landLordRoute);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app;
