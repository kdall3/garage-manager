import { db } from ".";
import { getCarFromReg } from "./cars";
import { getEmployeeById } from "./user";

export type AddShiftResult = 'OK' | 'CAR_NOT_FOUND' | 'EMPLOYEE_NOT_FOUND' | 'WRONG_DATE_ORDER'
export async function addShift(employee_id: number, reg_plate: string, start_time: Date, end_time: Date, notes: string): Promise<AddShiftResult> {
    const [car, employee] = await Promise.all([
        getCarFromReg(reg_plate),
        getEmployeeById(employee_id),
    ]);

    if (car === null) { return 'CAR_NOT_FOUND'; } // Car isn't in database
    if (employee === null) { return 'EMPLOYEE_NOT_FOUND'; } // User isn't in database
    if (end_time.getTime() <= start_time.getTime()) { return 'WRONG_DATE_ORDER'; } // End time before start time

    await db.query(
        'INSERT INTO hours (employee_id, reg_plate, start, end, notes) VALUES (?, ?, ?, ?, ?)',
        [employee_id, reg_plate, start_time, end_time, notes]
    );
    return 'OK';
}