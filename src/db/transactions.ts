import { db } from ".";

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
