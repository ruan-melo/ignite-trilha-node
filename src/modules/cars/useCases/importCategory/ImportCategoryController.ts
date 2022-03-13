import { Request, Response } from "express";
import { container } from "tsyringe";

import { AppError } from "../../../../errors/AppErrors";
import { ImportCategoryUseCase } from "./ImportCategoryUseCase";

export class ImportCategoryController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { file } = request;
        const importCategoryUseCase = container.resolve(ImportCategoryUseCase);
        if (!file) {
            throw new AppError("No file");
        }
        await importCategoryUseCase.execute(file);

        return response.status(201).send();
    }
}
