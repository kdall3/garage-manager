import { db } from ".";
import bcrypt from 'bcrypt';

interface Employee {
    employee_id: number;
    first_name: string;
    last_name: string;
    username: string;
    password_hash: string;
}

async function getEmployeeByUsername(username: string): Promise<Employee | null> {
    const [rows, fields] = await db.query<Employee>(
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
    return bcrypt.hash(password, 10)
}