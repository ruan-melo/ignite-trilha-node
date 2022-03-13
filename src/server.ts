import "reflect-metadata";

import "./database";
import "./shared/container";
import express, { NextFunction, Request, Response, response } from "express";
import "express-async-errors";
import swaggerUI from "swagger-ui-express";

import { AppError } from "./errors/AppErrors";
import { routes } from "./routes";
import swaggerFile from "./swagger.json";

const app = express();

const port = process.env.PORT || 3333;
app.use(express.json());

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerFile));

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

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
