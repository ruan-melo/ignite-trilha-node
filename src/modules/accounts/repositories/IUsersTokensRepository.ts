import { ICreateUserTokenDTO } from "../dto/ICreateUserTokenDTO";
import { UserTokens } from "../infra/typeorm/entities/UserTokens";

export interface IUsersTokensRepository {
    create(data: ICreateUserTokenDTO): Promise<UserTokens>;
    findByRefreshToken(refresh_token: string): Promise<UserTokens | undefined>;
    findByUserIdAndRefreshToken(
        user_id: string,
        refresh_token: string
    ): Promise<UserTokens | undefined>;
    deleteById(id: string): Promise<void>;
}
