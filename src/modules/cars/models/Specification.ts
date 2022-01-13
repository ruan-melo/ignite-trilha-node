import { v4 as uuid } from "uuid";

export class Specification {
    name: string;
    description: string;
    id?: string;
    created_at: Date;

    constructor() {
        if (!this.id) {
            this.id = uuid();
        }
    }
}
