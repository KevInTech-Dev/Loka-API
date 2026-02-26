import express, { Express, Request, Response } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import env from "@config/env";
import userRoute from "@modules/users/user.route";
import abonnementRoute from "@modules/abonnements/abonnement.route";
import swaggerSpec from "@/swagger";
import tenantRoute from "@/modules/tenant/tenant.routes"
import landLordRoute from "@/modules/landLord/landLord.route";
import propertyRoute from "@/modules/property/property.route";
import propertyTypeRoute from "@/modules/propertyType/propertyType.route";
import errorHandler, {
    notFoundHandler,
} from "@/modules/middleware/error.middleware";
import unitTypeRoute from "./modules/unitType/unitType.route";
import unitLocationRoute from "./modules/unitLocation/unitLocation.route";
import propertyUnitLocationRoute from "./modules/propertyUnitLocation/propertyUnitLocation.route";

const app: Express = express();
const API_PREFIX = env.API_PREFIX;

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


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
app.use(`${API_PREFIX}/unitType`, unitTypeRoute);
app.use(`${API_PREFIX}/unitLocation`, unitLocationRoute);
app.use(`${API_PREFIX}/propertyUnitLocation`, propertyUnitLocationRoute);
app.use(`${API_PREFIX}/tenants`, tenantRoute)

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app;
