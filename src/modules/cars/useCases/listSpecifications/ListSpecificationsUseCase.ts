import { ISpecificationsRepository } from "../../repositories/ISpecificationsRepository";

export class ListSpecificationsUseCase {
    constructor(private specificationsRepository: ISpecificationsRepository) {}

    execute() {
        const specifications = this.specificationsRepository.list();

        return specifications;
    }
}
