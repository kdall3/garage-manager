import { db } from ".";

async function addShift(employee_id: number, start_time: Date, end_time: Date) {
    db.query('INSERT INTO employees (employee_id, reg_plate, )')
}