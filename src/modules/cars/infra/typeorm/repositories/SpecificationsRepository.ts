import { getRepository, Repository } from "typeorm";

import {
    ICreateSpecificationDTO,
    ISpecificationsRepository,
} from "@modules/cars/repositories/ISpecificationsRepository";

import { Specification } from "../entities/Specification";

export class SpecificationsRepository implements ISpecificationsRepository {
    private repository: Repository<Specification>;

    public constructor() {
        this.repository = getRepository(Specification);
    }

    async create({
        name,
        description,
    }: ICreateSpecificationDTO): Promise<Specification> {
        const specification = this.repository.create({ name, description });

        await this.repository.save(specification);

        return specification;
    }

    async findByName(name: string): Promise<Specification | undefined> {
        const specification = await this.repository.findOne({
            where: { name },
        });
        return specification;
    }

    async list(): Promise<Specification[]> {
        const specifications = await this.repository.find();
        return specifications;
    }

    async findByIds(ids: string[]): Promise<Specification[]> {
        const specifications = await this.repository.findByIds(ids);

        return specifications;
    }
}
