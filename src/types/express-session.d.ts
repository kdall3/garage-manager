import "express-session";
import { DB } from "../db";
import { Employee } from "../db/user";
import { EmployeeShifts } from '../db/hours';

declare module "express-session" {
  interface SessionData {
    // Forms
    form_values?: Record<string, string>;
    input_errors?: Record<string, string>;
    success_message?: string;

    // Middleware
    return_to_url?: string;

    // DB
    user_id?: number;
    db?: DB
  }
}