import { CategoriesRepositoryInMemory } from "@modules/cars/repositories/in-memory/CategoriesRepositoryInMemory";
import { AppError } from "@shared/errors/AppErrors";

import { CreateCategoryUseCase } from "./CreateCategoryUseCase";

let categoriesRepositoryInMemory: CategoriesRepositoryInMemory;
let createCategoryUseCase: CreateCategoryUseCase;

describe("Create Category", () => {
    beforeEach(() => {
        categoriesRepositoryInMemory = new CategoriesRepositoryInMemory();
        createCategoryUseCase = new CreateCategoryUseCase(
            categoriesRepositoryInMemory
        );
    });

    it("Should be able to create a new category", async () => {
        const category = {
            name: "Category Test",
            description: "Category Test description",
        };

        await createCategoryUseCase.execute(category);

        const categoryCreated = await categoriesRepositoryInMemory.findByName(
            category.name
        );

        expect(categoryCreated).toHaveProperty("id");
    });

    it("Should NOT be able to create a new category with name exists", async () => {
        const category = {
            name: "Category Test",
            description: "Category Test description",
        };

        await createCategoryUseCase.execute(category);

        await expect(createCategoryUseCase.execute(category)).rejects.toEqual(
            new AppError("Category already exists")
        );
    });
});
