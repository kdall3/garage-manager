import "express-session";
import { DB } from "../db";

declare module "express-session" {
  interface SessionData {
    loggedIn?: boolean;
    db?: DB
  }
}