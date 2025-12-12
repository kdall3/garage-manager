import express, { Request, Response, NextFunction } from "express";
import { checkPassword } from "../db/user";

export const loginRouter = express.Router();

loginRouter
    .route('/')
    .get((req: Request, res: Response) => {
        res.render('login');
    })
    .post(async (req: Request, res: Response, next: NextFunction) => {
        res.send(await checkPassword(req.body.username, req.body.password));
        next();
    });