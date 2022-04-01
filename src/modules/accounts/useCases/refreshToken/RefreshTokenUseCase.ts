import { sign, verify } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import auth from "@config/auth";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppErrors";

interface IPayload {
    sub: string;
    email: string;
}

@injectable()
export class RefreshTokenUseCase {
    constructor(
        @inject("UsersTokensRepository")
        private usersTokensRepository: IUsersTokensRepository,
        @inject("DayjsDateProvider") private dateProvider: IDateProvider
    ) {}
    async execute(token: string) {
        const {
            expires_in_token,
            expires_in_refresh_token,
            secret_token,
            expires_in_refresh_token_days,
            secret_refresh_token,
        } = auth;

        const { email, sub: user_id } = verify(
            token,
            secret_refresh_token
        ) as IPayload;

        const userToken =
            await this.usersTokensRepository.findByUserIdAndRefreshToken(
                user_id,
                token
            );

        if (!userToken) {
            throw new AppError("Refresh token does not exist");
        }

        await this.usersTokensRepository.deleteById(userToken.id);

        const refresh_token = sign({ email }, secret_refresh_token, {
            subject: user_id,
            expiresIn: expires_in_refresh_token,
        });

        const refresh_token_expires_date = this.dateProvider.addDays(
            expires_in_refresh_token_days
        );

        await this.usersTokensRepository.create({
            expires_date: refresh_token_expires_date,
            user_id,
            refresh_token,
        });

        const newToken = sign({}, auth.secret_token, {
            subject: user_id,
            expiresIn: auth.expires_in_token,
        });

        return { refresh_token, token: newToken };
    }
}
