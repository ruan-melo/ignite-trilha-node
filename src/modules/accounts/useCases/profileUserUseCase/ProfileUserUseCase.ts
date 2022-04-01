import { inject, injectable } from "tsyringe";

import { IUserResponseDTO } from "@modules/accounts/dto/IUserResponseDTO";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { UserMap } from "@modules/accounts/mappers/UserMap";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { AppError } from "@shared/errors/AppErrors";

@injectable()
export class ProfileUserUseCase {
    constructor(
        @inject("UsersRepository") private usersRepository: IUsersRepository
    ) {}

    async execute(id: string): Promise<IUserResponseDTO> {
        const user = await this.usersRepository.findById(id);

        if (!user) {
            throw new AppError("User doest not exists");
        }

        return UserMap.toDTO(user);
    }
}
