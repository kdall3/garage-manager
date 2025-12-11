import express, { Request, Response, NextFunction } from "express";
import { requireLogin } from "../middleware/requireLogin";

export const loginRouter = express.Router();

loginRouter
    .route('/')
    .get((req: Request, res: Response) => {
        res.render('login');
    })
    .post((req: Request, res: Response, next: NextFunction) => {
        console.log(req.body);
        next();
    });