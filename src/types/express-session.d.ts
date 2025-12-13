import "express-session";
import { DB } from "../db";
import { Employee } from "../db/user";

declare module "express-session" {
  interface SessionData {
    // Forms
    form_values?: Record<string, string>;
    input_errors?: Record<string, string>;
    success_message?: string;

    return_to_url?: string;
    
    user_id?: number;
    db?: DB
  }
}