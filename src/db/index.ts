import mysql, { Pool, FieldPacket, RowDataPacket } from 'mysql2/promise';
import { config } from '../config/env'

export interface DB {
    pool: mysql.Pool;

    // Generic query wrapper, the generic type should contain the expected fields of a single row
    query<T = any>(sql: string, params?: any[]): Promise<[T[], FieldPacket[]]>;
}

const pool = mysql.createPool({
    host: config.DB_HOST,
    user: config.DB_USER,
    database: config.DB_NAME,
    password: config.DB_PASSWORD,
    port: config.DB_PORT
});

export const db: DB = {
    pool,
    query: async (sql, params) => {
        try {
            const [rows, fields] = await pool.query<RowDataPacket[]>(sql, params);
            return [rows as any, fields];
        } catch (err) {
            throw new Error(`Database connection failed: ${err}`);
        }
    }
}