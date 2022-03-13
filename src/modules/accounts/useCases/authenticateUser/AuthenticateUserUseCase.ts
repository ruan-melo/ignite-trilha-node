import { compare } from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../errors/AppErrors";
import { User } from "../../entities/User";
import { IUsersRepository } from "../../repositories/IUsersRepository";

interface IRequest {
    email: string;
    password: string;
}

interface IResponse {
    user: { name: string; email: string };
    token: string;
}

@injectable()
export class AuthenticateUserUseCase {
    constructor(
        @inject("UsersRepository") private usersRepository: IUsersRepository
    ) {}
    async execute({ email, password }: IRequest): Promise<IResponse> {
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new AppError("Invalid Credentials");
        }

        const passwordMatch = await compare(password, user.password);

        if (!passwordMatch) {
            throw new AppError("Invalid Credentials");
        }

        const token = sign({}, "399b90dd4242537998acbc07610a46c8", {
            subject: user.id,
            expiresIn: "1d",
        });

        return { user: { name: user.name, email: user.email }, token };
    }
}
