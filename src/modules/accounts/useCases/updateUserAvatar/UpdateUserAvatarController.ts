import { Request, Response } from "express";
import { container } from "tsyringe";

import { AppError } from "../../../../errors/AppErrors";
import { UpdateUserAvatarUseCase } from "./UpdateUserAvatarUseCase";

export class UpdateUserAvatarController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.user;

        const updateUserAvatarUseCase = container.resolve(
            UpdateUserAvatarUseCase
        );

        const avatarFile = request.file?.filename;

        if (!avatarFile) {
            throw new AppError("Invalid file", 400);
        }

        await updateUserAvatarUseCase.execute({ user_id: id, avatarFile });

        return response.status(204).send();
    }
}
