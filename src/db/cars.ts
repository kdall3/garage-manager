import { db } from ".";

export interface Car {
    reg_plate: string;
    make: string;
    model: string;
    year: number;
    mileage: number;
    colour: number;
    damage: string;
    description: string;
    status: string;
}

export async function getCarFromReg(reg_plate: string): Promise<Car | null> {
    const [rows, fields] = await db.query<Car>(
        'SELECT reg_plate, make, model, year, mileage, colour, damage, description, status FROM cars WHERE reg_plate = ?',
        [reg_plate]
    )

    if (rows.length === 1) { return rows[0] ?? null; }

    return null;
}