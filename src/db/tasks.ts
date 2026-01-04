import { db } from ".";
import { getCarFromReg } from "./cars";
import { getEmployeeById, Employee } from './user';

// Employee name to list of shifts
export interface Task {
    task_id: number,
    task: string,
    reg_plate: string,
    priority: number  
}

export async function getActiveTasks(): Promise<Task[]> {

    const [rows] = await db.query<Task>(
        `
        SELECT task_id, task, reg_plate, priority, active
        FROM tasks
        WHERE active=TRUE
        ORDER BY active DESC, priority
        `
    );
    return rows;
}

export async function getAllTasks(reg_plate?: string): Promise<Task[]> {
    if(!reg_plate) {
        const [rows] = await db.query<Task>(
            `
            SELECT task_id, task, reg_plate, priority, active 
            FROM tasks
            ORDER BY active DESC, priority
            `
        );
        return rows;
    } else {
        const [rows] = await db.query<Task>(
            `
            SELECT task_id, task, reg_plate, priority, active
            FROM tasks
            WHERE reg_plate=?
            ORDER BY active DESC, priority
            `,
            [reg_plate]
        );
        return rows;
    }
}

export async function toggleActive(task_id: number, active: boolean): Promise<void> {
    
    if (active) {
        await db.query(
            `
            UPDATE tasks
            SET active=FALSE
            WHERE task_id=?
            `,
            [task_id]
    );
    } else {
        await db.query(
            `
            UPDATE tasks
            SET active=TRUE
            WHERE task_id=?
            `,
            [task_id]
    );
    }
    
}

export async function addTask(task: string, reg_plate: string, priority: number): Promise<'OK'> {
    await db.query(
        `
        INSERT INTO tasks(task, reg_plate, priority)
        VALUES (?, ?, ?)
        `,
        [task, reg_plate, priority]
    )
    return 'OK'
}