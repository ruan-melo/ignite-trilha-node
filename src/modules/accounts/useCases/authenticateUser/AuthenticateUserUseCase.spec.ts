import { ICreateUserDTO } from "@modules/accounts/dto/ICreateUserDTO";
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "@shared/errors/AppErrors";

import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let usersRepositoryInMemory: UsersRepositoryInMemory;
let authenticateUserUseCase: AuthenticateUserUseCase;
let usersTokensRepository: UsersTokensRepositoryInMemory;
let dayjsDateProvider: DayjsDateProvider;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory();
        usersTokensRepository = new UsersTokensRepositoryInMemory();

        dayjsDateProvider = new DayjsDateProvider();
        authenticateUserUseCase = new AuthenticateUserUseCase(
            usersRepositoryInMemory,
            usersTokensRepository,
            dayjsDateProvider
        );

        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    });

    it("Should be able to authenticate an user", async () => {
        const user: ICreateUserDTO = {
            name: "User Test",
            email: "user@test.com",
            password: "123456",
            driver_license: "000123",
        };

        await createUserUseCase.execute(user);

        const response = await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password,
        });

        expect(response).toHaveProperty("token");
    });

    it("Should NOT be able to authenticate an user with invalid credentials", async () => {
        const user: ICreateUserDTO = {
            name: "User Test",
            email: "user@test.com",
            password: "123456",
            driver_license: "000123",
        };

        await createUserUseCase.execute(user);

        await expect(
            authenticateUserUseCase.execute({
                email: "wrong@email.com",
                password: user.password,
            })
        ).rejects.toEqual(new AppError("Invalid Credentials"));
    });

    it("Should NOT be able to authenticate a nonexistent user", async () => {
        await expect(
            authenticateUserUseCase.execute({
                email: "undefined@test.com",
                password: "123123",
            })
        ).rejects.toEqual(new AppError("Invalid Credentials"));
    });
});
