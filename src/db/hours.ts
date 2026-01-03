import { db } from ".";
import { getCarFromReg } from "./cars";
import { getEmployeeById, Employee } from './user';

// Employee name to list of shifts
export interface EmployeeShifts {
  employee_name: string;
  shifts: {
    start_hour: number;
    start_minute: number;
    end_hour: number;
    end_minute: number;
    reg_plate: string;
    make_model: string;
    notes: string;
  }[];
}

// Internal DB representation of a shift
interface Shift {
    shift_id: number,
    employee_id: number,
    first_name: string,
    last_name: string,
    reg_plate: string,
    car_make: string,
    car_model: string
    start: Date,
    end: Date,
    notes: string
}

export interface EmployeeHours {
  employee_id: number;
  first_name: string;
  last_name: string;
  total_hours: number;
}

// Total hours worked for each reg plate
export interface CarHours {
    reg_plate: string;
    total_hours: number;
}

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

export async function getShiftsOnDate(date: Date): Promise<EmployeeShifts[]> {
    const [rows] = await db.query<Shift>(
        'SELECT hours.shift_id, hours.employee_id, employees.first_name, employees.last_name, cars.reg_plate, cars.make AS car_make, cars.model AS car_model, hours.start, hours.end, hours.notes \
        FROM hours \
        JOIN employees ON hours.employee_id = employees.employee_id \
        JOIN cars ON hours.reg_plate = cars.reg_plate \
        WHERE DATE(start) = ? OR DATE(end) = ?',
        [date, date]
    );

    // Convert to employee => shift 'map'
    const employee_shifts: EmployeeShifts[] = rows.reduce((acc: EmployeeShifts[], shift) => {
        const employee_name = `${shift.first_name} ${shift.last_name}`;
        let employee_shift = acc.find(e => e.employee_name === employee_name);

        if (!employee_shift) {
            // If not found, create a new entry
            employee_shift = { employee_name: employee_name, shifts: [] };
            acc.push(employee_shift);
        }

        // Add shift
        employee_shift.shifts.push({
            start_hour: shift.start.getHours(),
            start_minute: shift.start.getMinutes(),
            end_hour: shift.end.getHours(),
            end_minute: shift.end.getMinutes(),
            reg_plate: shift.reg_plate,
            make_model: `${shift.car_make} ${shift.car_model}`,
            notes: shift.notes
        });

        return acc;
    }, [])

    return employee_shifts;
}

export async function hoursPerCar(): Promise<Map<string, number>> {
    const [rows] = await db.query<CarHours>(
    `
    SELECT
        reg_plate,
        ROUND(SUM(TIMESTAMPDIFF(MINUTE, start, end)) / 60, 2) AS total_hours
    FROM hours
    GROUP BY reg_plate
    `
    );

    const hoursMap = new Map(
        rows.map(car => [car.reg_plate, car.total_hours])
    );

    return hoursMap;
}

export async function hoursPerEmployee(reg_plate: string): Promise<EmployeeHours[]> {
    const [rows] = await db.query<EmployeeHours>(
    `
    SELECT
        e.employee_id AS employee_id,
        e.first_name,
        e.last_name,
        ROUND(SUM(TIMESTAMPDIFF(MINUTE, h.start, h.end)) / 60, 2) AS total_hours
    FROM hours h
    JOIN employees e
        ON e.employee_id = h.employee_id
    WHERE h.reg_plate = ?
    GROUP BY
        e.employee_id,
        e.first_name,
        e.last_name
    ORDER BY total_hours DESC;
    `,
    [reg_plate]
    );

    return rows;
}
