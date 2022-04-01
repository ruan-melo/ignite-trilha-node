import { hash } from "bcrypt";
import { inject, injectable } from "tsyringe";

import { ICreateUserDTO } from "@modules/accounts/dto/ICreateUserDTO";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { AppError } from "@shared/errors/AppErrors";

@injectable()
export class CreateUserUseCase {
    constructor(
        @inject("UsersRepository") private usersRepository: IUsersRepository
    ) {}

    async execute(data: ICreateUserDTO): Promise<User> {
        const userAlreadyExists = await this.usersRepository.findByEmail(
            data.email
        );

        if (userAlreadyExists) {
            throw new AppError("User already exists");
        }
        const passwordHash = await hash(data.password, 8);

        const user = await this.usersRepository.create({
            ...data,
            password: passwordHash,
        });

        return user;
    }
}
