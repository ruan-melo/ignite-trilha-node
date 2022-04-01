import { Specification } from "@modules/cars/infra/typeorm/entities/Specification";

import {
    ICreateSpecificationDTO,
    ISpecificationsRepository,
} from "../ISpecificationsRepository";

export class SpecificationsRepositoryInMemory
    implements ISpecificationsRepository
{
    private specifications: Specification[] = [];

    async findByName(name: string): Promise<Specification | undefined> {
        const specification = this.specifications.find((s) => s.name === name);

        return specification;
    }
    async list(): Promise<Specification[]> {
        return this.specifications;
    }
    async create({
        name,
        description,
    }: ICreateSpecificationDTO): Promise<Specification> {
        const specification = new Specification();

        Object.assign(specification, { name, description });

        this.specifications.push(specification);

        return specification;
    }
    async findByIds(ids: string[]): Promise<Specification[]> {
        const specifications = this.specifications.filter((s) =>
            ids.includes(s.id)
        );

        return specifications;
    }
}
