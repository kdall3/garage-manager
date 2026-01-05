import { db } from ".";
import { getCarFromReg } from "./cars";

export interface Transaction {
  reg_plate: string;
  title: string;
  price: number;
  date: string;
  platform: string | null;
}

export async function getTransaction(transaction_id: string): Promise<Transaction | null> {
  const [rows, fields] = await db.query<Transaction>(
    `
    SELECT transactionID, reg_plate, title, price, date, platform
    FROM transactions
    WHERE transactionID=?
    `,
    [transaction_id]
  );

  if (rows.length === 1) { return rows[0] ?? null; }

  return null;
}

export async function getLatestTransactions(limit = 20): Promise<Transaction[]> {
  const [rows] = await db.query<Transaction>(
    `
    SELECT transactionID, reg_plate, title, price, date, platform
    FROM transactions
    ORDER BY date DESC
    LIMIT ?
    `,
    [limit]
  );

  return rows;
}

export type AddTransactionResult = 'OK' | 'CAR_NOT_FOUND' 
export async function addTransaction(title: string, price: number, date: Date, platform: string, reg_plate: string | null): Promise<AddTransactionResult> {
  
  if (reg_plate == '') {
    reg_plate = null
  } 

  await db.query(
      `
      INSERT INTO transactions (reg_plate, title, price, platform, date) 
      VALUES (?, ?, ?, ?, ?)
      `,
      [reg_plate, title, price, platform, date]
  );
  return 'OK';
  }
  
export async function delTransaction(transaction_ID: number): Promise<void> {
  await db.query(
    `
    DELETE FROM transactions
    WHERE transactionID=?
    `,
    [transaction_ID]
  );
}
  
export async function editTransaction(transaction_ID: string | undefined, title: string, price: number, date: Date, platform: string, reg_plate: string): Promise<'OK' | 'NO_ID_PROVIDED'> {

  if (typeof transaction_ID === 'undefined') {
    return 'NO_ID_PROVIDED';
  } else {

    await db.query(
      `
      UPDATE transactions
      SET title=?, price=?, date=?, platform=?, reg_plate=?
      WHERE transactionID=?
      `,
      [title, price, date, platform, reg_plate, transaction_ID]
    );
    return 'OK';
  }
}

export async function carProfitLossByReg(reg_plate: string): Promise<number> {
  const [rows] = await db.query<{ profit_loss: number }>(
    `
    SELECT SUM(price) AS profit_loss
    FROM transactions
    WHERE reg_plate = ?
    `,
    [reg_plate]
  );

  return rows[0]?.profit_loss ?? 0;
}