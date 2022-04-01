import "reflect-metadata";
import "dotenv/config";

import "../../container";
import "../../container/providers";

import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";
import swaggerUI from "swagger-ui-express";

import upload from "@config/upload";
import { AppError } from "@shared/errors/AppErrors";

import swaggerFile from "../../../swagger.json";
import createConnection from "../typeorm";
import { routes } from "./routes";

createConnection();
const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerFile));

app.use("/avatar", express.static(`${upload.tmpFolder}/avatar`));
app.use("/cars", express.static(`${upload.tmpFolder}/cars`));

app.use(routes);
app.get("/", (req, res) => res.json({ message: "Hello World" }));

app.post("/courses", (request, response) => {
    const { name } = request.body;
    return response.json({ name });
});

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
