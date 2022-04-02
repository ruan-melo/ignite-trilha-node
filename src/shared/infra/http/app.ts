import "reflect-metadata";
import "dotenv/config";

import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";
import swaggerUI from "swagger-ui-express";

import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";

import "@shared/container";
import upload from "@config/upload";
import { AppError } from "@shared/errors/AppErrors";
import createConnection from "@shared/infra/typeorm";

import swaggerFile from "../../../swagger.json";
import { rateLimiter } from "./middlewares/rateLimiter";
import { routes } from "./routes";

createConnection();
const app = express();

app.use(rateLimiter);

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Tracing.Integrations.Express({ app }),
    ],
    tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.use(express.json());

app.get("/", (req, res) => res.json({ message: "Hello World" }));

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerFile));

app.use("/avatar", express.static(`${upload.tmpFolder}/avatar`));
app.use("/cars", express.static(`${upload.tmpFolder}/cars`));

app.use(cors());
app.use(routes);

app.use(Sentry.Handlers.errorHandler());

app.use(
    (err: Error, request: Request, response: Response, next: NextFunction) => {
        if (err instanceof AppError) {
            return response
                .status(err.statusCode)
                .json({ message: err.message });
        }

        console.error(err);

        return response.status(500).json({
            status: "error",
            message: `Internal server error - ${err.name} ${err.message}`,
        });
    }
);

export { app };
