import { ICreateUserDTO } from "../dto/ICreateUserDTO";
import { User } from "../entities/User";

export interface IUsersRepository {
    findByEmail(email: string): Promise<User | undefined>;
    findByUsername(username: string): Promise<User | undefined>;
    findById(id: string): Promise<User | undefined>;
    create(data: ICreateUserDTO): Promise<User>;
    list(): Promise<User[]>;
}
