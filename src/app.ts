import express, {Express, Request, Response} from "express";
import cors from "cors";
import swaggerUi from 'swagger-ui-express';
import env from "@config/env";
import userRoute from "@modules/users/user.route";
import abonnementRoute from "@modules/abonnements/abonnement.route";
import swaggerSpec from "@/swagger";

const app: Express = express();
const API_PREFIX = env.API_PREFIX;

app.use(express.json());

app.use(express.urlencoded({extended: true}));

//cors origin
app.use(cors());

// Swagger UI setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Rental Management API Documentation',
}));

app.get('/api-docs.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});


app.use(`${API_PREFIX}/users`, userRoute);
app.use(`${API_PREFIX}/abonnements`, abonnementRoute);

export default app;
