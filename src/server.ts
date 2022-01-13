import express, { response } from "express";
import swaggerUI from "swagger-ui-express";

import { routes } from "./routes";
import swaggerFile from "./swagger.json";

const app = express();

const port = process.env.PORT || 4000;
app.use(express.json());

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerFile));

app.use(routes);
app.get("/", (req, res) => res.json({ message: "Hello World" }));

app.post("/courses", (request, response) => {
    const { name } = request.body;
    return response.json({ name });
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
