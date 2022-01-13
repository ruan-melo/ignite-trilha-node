import { Request, Response } from "express";

import { ImportCategoryUseCase } from "./ImportCategoryUseCase";

export class ImportCategoryController {
    constructor(private importCategoryUseCase: ImportCategoryUseCase) {}

    handle(request: Request, response: Response): Response {
        const { file } = request;

        if (!file) {
            return response.status(400).send("No file");
        }
        this.importCategoryUseCase.execute(file);

        return response.send();
    }
}
