import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { AppError } from "@shared/errors/AppErrors";

import { CreateCarUseCase } from "./CreateCarUseCase";

let createCarUseCase: CreateCarUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("Create Car", () => {
    beforeEach(() => {
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
    });

    it("Should be able to create a new car", async () => {
        const car = await createCarUseCase.execute({
            name: "Car name",
            description: "Car description",
            daily_rate: 100,
            license_plate: "ABC-1234",
            fine_amount: 60,
            brand: "Brand",
            category_id: "category",
        });

        expect(car).toHaveProperty("id");
    });

    it("Should NOT be able to create a car with exists license_plate", async () => {
        await createCarUseCase.execute({
            name: "Car 2 name",
            description: "Car 2 description",
            daily_rate: 100,
            license_plate: "ABC-1234",
            fine_amount: 60,
            brand: "Brand",
            category_id: "category",
        });

        await expect(
            createCarUseCase.execute({
                name: "Car 2 name",
                description: "Car 2 description",
                daily_rate: 100,
                license_plate: "ABC-1234",
                fine_amount: 60,
                brand: "Brand",
                category_id: "category",
            })
        ).rejects.toEqual(new AppError("Car already exists"));
    });

    it("Should be able to create a new car with available true by default", async () => {
        const car = await createCarUseCase.execute({
            name: "Car name",
            description: "Car description",
            daily_rate: 100,
            license_plate: "CBA-1234",
            fine_amount: 60,
            brand: "Brand",
            category_id: "category",
        });

        expect(car.available).toBe(true);
    });
});
