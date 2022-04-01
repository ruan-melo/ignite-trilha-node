import { ICreateUserDTO } from "@modules/accounts/dto/ICreateUserDTO";
import { User } from "@modules/accounts/infra/typeorm/entities/User";

export interface IUsersRepository {
    findByEmail(email: string): Promise<User | undefined>;
    findById(id: string): Promise<User | undefined>;
    create(data: ICreateUserDTO): Promise<User>;
    list(): Promise<User[]>;
}
