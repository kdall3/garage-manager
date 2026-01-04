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
    `
    SELECT reg_plate, make, model, year, mileage, colour, damage, description, status 
    FROM cars 
    WHERE reg_plate = ?
    `,
    [reg_plate]
  )

  if (rows.length === 1) { return rows[0] ?? null; }

  return null;
}

export async function getCars(): Promise<Car[]> {
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
      c.reg_plate;
    `
  );

  return rows;
}

export async function addCar(reg_plate: string, make: string, model: string, year: number, mileage: number, colour: string, damage: string, description: string, status: string, buy_price: number, platform: string, buy_date: Date): Promise<'OK' | 'CAR_ALREADY_EXISTS'> {
  
  if (getCarFromReg(reg_plate) == null) {return 'CAR_ALREADY_EXISTS'}
  
  await db.query(
    `
    INSERT INTO cars (reg_plate, make, model, year, mileage, colour, damage, description, status) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [reg_plate, make, model, year, mileage, colour, damage, description, status]
  )
  
  await db.query(
    `
    INSERT INTO transactions (reg_plate, title, price, platform, date) 
    VALUES (?, "Car", ?, ?, ?)
    `,
    [reg_plate, buy_price, platform, buy_date]
  )
  
  return 'OK';
};

export async function editCarDetails(reg_plate: string, make: string, model: string, year: number, mileage: number, colour: string, damage: string, description: string, status: string): Promise<'OK' | 'CAR_DOESNT_EXIST'> {
  
  if (getCarFromReg(reg_plate) == null) {return 'CAR_DOESNT_EXIST'}
  
  await db.query(
    `
    UPDATE cars
    SET make = ?, model = ?, year = ?, mileage = ?, colour = ?, damage = ?, description = ?, status = ?
    WHERE reg_plate = ?
    `,
    [make, model, year, mileage, colour, damage, description, status, reg_plate]
  );
  
  return 'OK';
};

export async function sellCar(reg_plate: string, price: number, platform: string, sale_date: Date): Promise<'OK' | 'CAR_DOESNT_EXIST'> {

  if (getCarFromReg(reg_plate) == null) {return 'CAR_DOESNT_EXIST'}

  await db.query(
    `
    UPDATE cars
    SET status = "Sold"
    WHERE reg_plate = ?
    `,
    [reg_plate]
  );

  await db.query(
    `
    INSERT INTO transactions (reg_plate, title, price, platform, date) 
    VALUES (?, "Car", ?, ?, ?)
    `,
    [reg_plate, price, platform, sale_date]
  );

  return 'OK';
};