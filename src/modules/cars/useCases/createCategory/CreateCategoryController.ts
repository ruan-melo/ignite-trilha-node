import { Request, Response } from "express";

import { CreateCategoryUseCase } from "./CreateCategoryUseCase";

export class CreateCategoryController {
    constructor(private createCategoryUseCase: CreateCategoryUseCase) {}

    handle(request: Request, response: Response) {
        const { name, description } = request.body;

        try {
            this.createCategoryUseCase.execute({ name, description });
        } catch {
            return response
                .status(400)
                .json({ error: "Category already exists" });
        }

        return response.status(201).send();
    }
}
