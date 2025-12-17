import { db } from ".";
import { getCarFromReg } from "./cars";

export interface Transaction {
  reg_plate: string;
  title: string;
  price: number;
  date: string;
  platform: string | null;
}

export async function getLatestTransactions(
  limit = 20
): Promise<Transaction[]> {
  const [rows] = await db.query<Transaction>(
    `
    SELECT reg_plate, title, price, date, platform
    FROM transactions
    ORDER BY date DESC
    LIMIT ?
    `,
    [limit]
  );

  return rows;
}

export type AddTransactionResult = 'OK' | 'CAR_NOT_FOUND' 
export async function addTransaction(title: string, price: number, date: Date, platform: string, reg_plate: string): Promise<AddTransactionResult> {
    const car = await Promise.all([
        getCarFromReg(reg_plate),
    ]);

    if (car === null) { return 'CAR_NOT_FOUND'; } // Car isn't in database

    await db.query(
        'INSERT INTO transactions (reg_plate, title, price, platform, date) VALUES (?, ?, ?, ?, ?)',
        [reg_plate, title, price, platform, date]
    );
    return 'OK';
}
