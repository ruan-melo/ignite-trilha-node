import { Request, Response } from "express";

import { CreateSpecificationUseCase } from "./CreateSpecificationUseCase";

export class CreateSpecificationController {
    constructor(
        private createSpecificationUseCase: CreateSpecificationUseCase
    ) {}

    handle(request: Request, response: Response) {
        const { name, description } = request.body;

        try {
            this.createSpecificationUseCase.execute({ name, description });
        } catch {
            return response
                .status(400)
                .json({ error: "Specification already exists" });
        }

        return response.status(201).send();
    }
}
