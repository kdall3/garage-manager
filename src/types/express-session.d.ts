import "express-session";
import { DB } from "../db";

declare module "express-session" {
  interface SessionData {
    form_values: Record<string, string>;
    input_errors: Record<string, string>;
    loggedIn?: boolean;
    db?: DB
  }
}