import { ICreateUserTokenDTO } from "@modules/accounts/dto/ICreateUserTokenDTO";
import { UserTokens } from "@modules/accounts/infra/typeorm/entities/UserTokens";

import { IUsersTokensRepository } from "../IUsersTokensRepository";

export class UsersTokensRepositoryInMemory implements IUsersTokensRepository {
    private usersTokens: UserTokens[] = [];

    async create(data: ICreateUserTokenDTO): Promise<UserTokens> {
        const userToken = new UserTokens();

        Object.assign(userToken, data);

        this.usersTokens.push(userToken);

        return userToken;
    }

    async findByUserIdAndRefreshToken(
        user_id: string,
        refresh_token: string
    ): Promise<UserTokens | undefined> {
        return this.usersTokens.find(
            (ut) => ut.user_id === user_id && ut.refresh_token === refresh_token
        );
    }

    async findByRefreshToken(
        refresh_token: string
    ): Promise<UserTokens | undefined> {
        return this.usersTokens.find(
            (ut) => ut.refresh_token === refresh_token
        );
    }

    async deleteById(id: string): Promise<void> {
        const userToken = this.usersTokens.find((ut) => ut.id === id);
        if (userToken) {
            this.usersTokens.splice(this.usersTokens.indexOf(userToken));
        }
    }
}
