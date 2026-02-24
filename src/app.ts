import express, {Express, Request, Response} from "express";
import cors from "cors";
import swaggerUi from 'swagger-ui-express';
import env from "@config/env";
import userRoute from "@modules/users/user.route";
import abonnementRoute from "@modules/abonnements/abonnement.route";
import utilisateur_AbonnementRoute from "@modules/utilisateur_abonnement/utilisateur_abonnement.route";
import swaggerSpec from "@/swagger";
<<<<<<< Updated upstream
=======
import landLordRoute from "./modules/landLord/landLord.route";
import propertyRoute from "./modules/property/property.route";
import propertyTypeRoute from "./modules/propertyType/propertyType.route";
import { util } from "zod";
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
=======
app.use(`${API_PREFIX}/utilisateur-abonnement`, utilisateur_AbonnementRoute);
app.use(`${API_PREFIX}/landLords`, landLordRoute);
>>>>>>> Stashed changes

export default app;
