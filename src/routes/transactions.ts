import express, { Request, Response, NextFunction } from "express";
import { requireLogin } from "../middleware/requireLogin";
import { getLatestTransactions } from "../db/transactions";

export const transactionsRouter = express.Router();

transactionsRouter
    .route('/')
    .get(requireLogin, async (req: Request, res: Response) => {
        const transactions = await getLatestTransactions(20);
        res.render('transactions/transactions', {
            transactions
        });
    })

transactionsRouter
  .route('/add')  
  .get(requireLogin, (req: Request, res: Response) => {
    res.render("transactions/add", {
      form_values: {},
      input_errors: {}
    });
  });