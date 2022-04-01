import { getRepository, Repository } from "typeorm";

import { ICreateUserDTO } from "@modules/accounts/dto/ICreateUserDTO";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";

export class UsersRepository implements IUsersRepository {
    private repository: Repository<User>;

    constructor() {
        this.repository = getRepository(User);
    }
    async findByEmail(email: string): Promise<User | undefined> {
        const user = await this.repository.findOne({ where: { email } });
        return user;
    }

    async findById(id: string): Promise<User | undefined> {
        const user = await this.repository.findOne({ where: { id } });
        return user;
    }
    async create(data: ICreateUserDTO): Promise<User> {
        const user = this.repository.create(data);

        await this.repository.save(user);

        return user;
    }
    async list(): Promise<User[]> {
        const users = await this.repository.find();
        return users;
    }
}
