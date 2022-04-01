import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { EtherealMailProvider } from "@shared/container/providers/MailProvider/implementations/EtherealMailProvider";
import { MailProviderInMemory } from "@shared/container/providers/MailProvider/in-memory/MailProviderInMemory";
import { AppError } from "@shared/errors/AppErrors";

import { SendForgotPasswordMailUseCase } from "./SendForgotPasswordMailUseCase";

let usersRepositoryInMemory: UsersRepositoryInMemory;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let mailProvider: MailProviderInMemory;
let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;

describe("Send Forgot Password Mail", () => {
    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory();
        usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();

        dateProvider = new DayjsDateProvider();
        mailProvider = new MailProviderInMemory();

        sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
            usersRepositoryInMemory,
            usersTokensRepositoryInMemory,
            dateProvider,
            mailProvider
        );
    });
    it("Should be email to send a forgot password mail to user", async () => {
        const sendMail = jest.spyOn(mailProvider, "sendMail");
        const user = await usersRepositoryInMemory.create({
            driver_license: "123123",
            email: "test@rentx.com.br",
            name: "Teste",
            password: "123456",
        });

        await sendForgotPasswordMailUseCase.execute(user.email);

        expect(sendMail).toHaveBeenCalled();
    });

    it("Should NOT be email to send a forgot password mail to a non-existent user", async () => {
        await expect(
            sendForgotPasswordMailUseCase.execute("teste@gmail.com.br")
        ).rejects.toEqual(new AppError("User does not exists!"));
    });

    it("Should be email to send a forgot password mail to a non-existent user", async () => {
        const generateTokenMail = jest.spyOn(
            usersTokensRepositoryInMemory,
            "create"
        );

        const user = await usersRepositoryInMemory.create({
            driver_license: "123123",
            email: "test@rentx.com.br",
            name: "Teste",
            password: "123456",
        });

        await sendForgotPasswordMailUseCase.execute(user.email);

        expect(generateTokenMail).toHaveBeenCalled();
    });
});
