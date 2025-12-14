import { db } from ".";
import bcrypt from 'bcrypt';

export interface Employee {
    employee_id: number;
    first_name: string;
    last_name: string;
    username: string;
    password_hash: string;
}

export async function getIdByUsername(username: string): Promise<number | null> {
    const [rows] = await db.query<{ employee_id: number }>(
        'SELECT employee_id FROM employees WHERE username = ?',
        [username]
    );

    return rows[0]?.employee_id ?? null;
}

export async function getEmployeeById(employee_id: number): Promise<Employee | null> {
    const [rows] = await db.query<Employee>(
        'SELECT employee_id, first_name, last_name, username, password_hash FROM employees WHERE employee_id = ?',
        [employee_id]
    );

    return rows[0] ?? null;
}

export async function getEmployeeByUsername(username: string): Promise<Employee | null> {
    const [rows] = await db.query<Employee>(
        'SELECT employee_id, first_name, last_name, username, password_hash FROM employees WHERE username = ?',
        [username]
    );

    return rows[0] ?? null;
}

export type CheckPasswordResult = 'USER_NOT_FOUND' | 'INVALID_PASSWORD' | 'OK';
export async function checkPassword(username: string, password: string): Promise<CheckPasswordResult> {
    // Get user
    let user = await getEmployeeByUsername(username);
    if (user == null) { return 'USER_NOT_FOUND' }

    // Check password
    if (await bcrypt.compare(password, user.password_hash) === true) { return 'OK'; }
    return 'INVALID_PASSWORD';
}

export async function hashPassword(password: string): Promise<string> {
    const SALT_ROUNDS = 10;
    return bcrypt.hash(password, SALT_ROUNDS)
}
