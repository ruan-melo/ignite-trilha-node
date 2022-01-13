import { Specification } from "../models/Specification";

export interface ICreateSpecificationDTO {
    name: string;
    description: string;
}

export interface ISpecificationsRepository {
    findByName(name: string): Specification | undefined;
    list(): Specification[];
    create({ name, description }: ICreateSpecificationDTO): Specification;
}
