import express, { Request, Response, NextFunction } from "express";
import { requireLogin } from "../middleware/requireLogin";

export const transactionsRouter = express.Router();

transactionsRouter
    .route('/')
    .get(requireLogin, (req: Request, res: Response) => {
        res.render('transactions/transactions', {
        });
    })

transactionsRouter
  .route('/add')  
  .get(requireLogin, (req: Request, res: Response) => {
    res.render("transactions/add");
  });