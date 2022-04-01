import { ICreateRentalDTO } from "../dtos/ICreateRentalDTO";
import { Rental } from "../infra/typeorm/entities/Rental";

export interface IRentalsRepository {
    create(data: ICreateRentalDTO): Promise<Rental>;
    findOpenRentalByCar(car_id: string): Promise<Rental | undefined>;
    findOpenRentalByUser(user_id: string): Promise<Rental | undefined>;
    findById(id: string): Promise<Rental | undefined>;
    findByUser(user_id: string): Promise<Rental[]>;
}
