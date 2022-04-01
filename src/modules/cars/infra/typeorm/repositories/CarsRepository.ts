import { getRepository, Repository } from "typeorm";

import { ICreateCarDTO } from "@modules/cars/dtos/ICreateCarDTO";
import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";

import { Car } from "../entities/Car";

export class CarsRepository implements ICarsRepository {
    private repository: Repository<Car>;

    constructor() {
        this.repository = getRepository(Car);
    }
    async updateAvailable(id: string, available: boolean): Promise<void> {
        await this.repository
            .createQueryBuilder()
            .update()
            .set({ available })
            .where("id = :id")
            .setParameters({ id })
            .execute();
    }

    async create(data: ICreateCarDTO): Promise<Car> {
        const car = this.repository.create(data);

        await this.repository.save(car);

        return car;
    }

    async findById(id: string): Promise<Car | undefined> {
        const car = this.repository.findOne({ where: { id } });

        return car;
    }

    async findByLicensePlate(license_plate: string): Promise<Car | undefined> {
        const car = await this.repository.findOne({
            where: { license_plate },
        });

        return car;
    }

    async findAvailable(
        brand?: string,
        category_id?: string,
        name?: string
    ): Promise<Car[]> {
        const carsQuery = this.repository
            .createQueryBuilder("c")
            .where("available = :available", { available: true });

        if (brand) {
            carsQuery.andWhere("brand = :brand", { brand });
        }

        if (name) {
            carsQuery.andWhere("name = :name", { name });
        }

        if (category_id) {
            carsQuery.andWhere("category_id = :category_id", { category_id });
        }

        const cars = await carsQuery.getMany();

        return cars;
    }
}
