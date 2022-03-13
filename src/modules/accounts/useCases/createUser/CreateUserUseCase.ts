import { hash } from "bcrypt";
import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../errors/AppErrors";
import { ICreateUserDTO } from "../../dto/ICreateUserDTO";
import { User } from "../../entities/User";
import { IUsersRepository } from "../../repositories/IUsersRepository";

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
