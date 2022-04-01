import { ICreateRentalDTO } from "@modules/rentals/dtos/ICreateRentalDTO";
import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";

import { IRentalsRepository } from "../IRentalsRepository";

export class RentalsRepositoryInMemory implements IRentalsRepository {
    private rentals: Rental[] = [];

    async create(data: ICreateRentalDTO): Promise<Rental> {
        const rental = new Rental();

        Object.assign(rental, { ...data, start_date: new Date() });

        this.rentals.push(rental);

        return rental;
    }

    async findById(id: string): Promise<Rental | undefined> {
        return this.rentals.find((rental) => rental.id === id);
    }

    async findOpenRentalByCar(car_id: string): Promise<Rental | undefined> {
        const car = this.rentals.find(
            (r) => r.car_id === car_id && !r.end_date
        );

        return car;
    }
    async findOpenRentalByUser(user_id: string): Promise<Rental | undefined> {
        const car = this.rentals.find(
            (r) => r.user_id === user_id && !r.end_date
        );

        return car;
    }

    async findByUser(user_id: string): Promise<Rental[]> {
        return this.rentals.filter((rental) => rental.user_id === user_id);
    }
}
