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

export async function getCarsInStock(): Promise<Car[]> {
  const [rows] = await db.query<Car>(
    `
    SELECT
      c.reg_plate,
      c.make,
      c.model,
      c.year,
      c.mileage,
      c.status,
      SUM(t.price) AS profit_loss
    FROM cars c
    LEFT JOIN transactions t
    ON t.reg_plate = c.reg_plate
    GROUP BY
      c.reg_plate,
      c.make,
      c.model,
      c.year,
      c.mileage,
      c.status
    ORDER BY c.reg_plate;
    `
  );

  return rows;
}
