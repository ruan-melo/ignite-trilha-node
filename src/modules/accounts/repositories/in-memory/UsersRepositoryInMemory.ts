import { ICreateUserDTO } from "@modules/accounts/dto/ICreateUserDTO";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";

export class UsersRepositoryInMemory implements IUsersRepository {
    private users: User[] = [];

    async findByEmail(email: string): Promise<User | undefined> {
        return this.users.find((user) => user.email === email);
    }

    async findById(id: string): Promise<User | undefined> {
        return this.users.find((user) => user.id === id);
    }
    async create(data: ICreateUserDTO): Promise<User> {
        const user = new User();

        Object.assign(user, data);

        this.users.push(user);

        return user;
    }
    async list(): Promise<User[]> {
        return this.users;
    }
}
