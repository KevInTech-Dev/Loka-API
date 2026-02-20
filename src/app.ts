import { Express } from "express";
import express from "express";
import cors from "cors";
import { specs, swaggerUi } from "./config/swagger";

const app: Express = express();

app.use(express.json());

// app.use(express.urlencoded({ extended: true }));

//cors origin
app.use(cors());

// Swagger UI setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

export default app;
