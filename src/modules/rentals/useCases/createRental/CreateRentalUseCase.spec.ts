import dayjs from "dayjs";

import { ICreateCarDTO } from "@modules/cars/dtos/ICreateCarDTO";
import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { CreateCarUseCase } from "@modules/cars/useCases/createCar/CreateCarUseCase";
import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "@shared/errors/AppErrors";

import { CreateRentalUseCase } from "./CreateRentalUseCase";

let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let createCarUseCase: CreateCarUseCase;
let createRentalUseCase: CreateRentalUseCase;
let dayjsDateProvider: DayjsDateProvider;

describe("Create Rental", () => {
    const dayAdd24hours = dayjs().add(1, "day").toDate();
    beforeEach(() => {
        dayjsDateProvider = new DayjsDateProvider();
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        rentalsRepositoryInMemory = new RentalsRepositoryInMemory();

        createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
        createRentalUseCase = new CreateRentalUseCase(
            rentalsRepositoryInMemory,
            dayjsDateProvider,
            carsRepositoryInMemory
        );
    });

    it("Should be able to create a new rental", async () => {
        const car: ICreateCarDTO = {
            name: "Car test",
            description: "Car test",
            license_plate: "ABC-123",
            brand: "Brand",
            daily_rate: 100,
            category_id: "123",
            fine_amount: 100,
        };

        const carCreated = await createCarUseCase.execute(car);

        const rental = await createRentalUseCase.execute({
            user_id: "123",
            car_id: carCreated.id,
            expected_return_date: dayAdd24hours,
        });

        expect(rental).toHaveProperty("id");
        expect(rental).toHaveProperty("start_date");
    });

    it("Should NOT be able to create a new rental if there is another open to the same user", async () => {
        expect(async () => {
            const car: ICreateCarDTO = {
                name: "Car test",
                description: "Car test",
                license_plate: "ABC-123",
                brand: "Brand",
                daily_rate: 100,
                category_id: "123",
                fine_amount: 100,
            };

            const carTwo: ICreateCarDTO = {
                name: "Car test two",
                description: "Car test two",
                license_plate: "ABC-321",
                brand: "Brand",
                daily_rate: 100,
                category_id: "123",
                fine_amount: 100,
            };

            const carCreated = await createCarUseCase.execute(car);
            const carTwoCreated = await createCarUseCase.execute(carTwo);

            await createRentalUseCase.execute({
                user_id: "123",
                car_id: carCreated.id,
                expected_return_date: dayAdd24hours,
            });

            await createRentalUseCase.execute({
                user_id: "123",
                car_id: carTwoCreated.id,
                expected_return_date: dayAdd24hours,
            });
        }).rejects.toBeInstanceOf(AppError);
    });

    it("Should NOT be able to create a new rental if there is another open to the same car", async () => {
        expect(async () => {
            const car: ICreateCarDTO = {
                name: "Car test",
                description: "Car test",
                license_plate: "ABC-123",
                brand: "Brand",
                daily_rate: 100,
                category_id: "123",
                fine_amount: 100,
            };

            const carCreated = await createCarUseCase.execute(car);

            await createRentalUseCase.execute({
                user_id: "1",
                car_id: carCreated.id,
                expected_return_date: dayAdd24hours,
            });

            await createRentalUseCase.execute({
                user_id: "2",
                car_id: carCreated.id,
                expected_return_date: dayAdd24hours,
            });
        }).rejects.toBeInstanceOf(AppError);
    });

    it("Should NOT be able to create a new rental with invalid return time", async () => {
        expect(async () => {
            const car: ICreateCarDTO = {
                name: "Car test",
                description: "Car test",
                license_plate: "ABC-123",
                brand: "Brand",
                daily_rate: 100,
                category_id: "123",
                fine_amount: 100,
            };

            const carCreated = await createCarUseCase.execute(car);

            await createRentalUseCase.execute({
                user_id: "1",
                car_id: carCreated.id,
                expected_return_date: dayjs().toDate(),
            });
        }).rejects.toEqual(new AppError("Invalid return time"));
    });
});
