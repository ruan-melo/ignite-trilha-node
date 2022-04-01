import { ICreateCarDTO } from "@modules/cars/dtos/ICreateCarDTO";
import { Car } from "@modules/cars/infra/typeorm/entities/Car";

import { ICarsRepository } from "../ICarsRepository";

export class CarsRepositoryInMemory implements ICarsRepository {
    async updateAvailable(id: string, available: boolean): Promise<void> {
        const carIndex = this.cars.findIndex((car) => car.id === id);
        this.cars[carIndex].available = available;
    }
    private cars: Car[] = [];

    async create(data: ICreateCarDTO): Promise<Car> {
        const car = new Car();

        Object.assign(car, data);

        this.cars.push(car);

        return car;
    }

    async findById(id: string): Promise<Car | undefined> {
        const car = this.cars.find((c) => c.id === id);

        return car;
    }

    async findByLicensePlate(license_plate: string): Promise<Car | undefined> {
        const car = this.cars.find((c) => c.license_plate === license_plate);

        return car;
    }

    async findAvailable(
        brand?: string,
        category_id?: string,
        name?: string
    ): Promise<Car[]> {
        let availableCars = this.cars.filter((car) => car.available);

        if (!name && !brand && !category_id) return availableCars;

        availableCars = availableCars.filter((car) => {
            if (car.name === name) return true;
            if (car.brand === brand) return true;
            if (car.category_id === category_id) return true;

            return false;
        });

        return availableCars;
    }
}
