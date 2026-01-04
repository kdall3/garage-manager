import express, { Request, Response, NextFunction } from "express";
import { requireLogin } from "../middleware/requireLogin";
import { getLatestTransactions } from "../db/transactions";
import { addTransaction } from "../db/transactions";
import { delTransaction } from "../db/transactions";
import { editTransaction } from "../db/transactions";
import { getTransaction } from "../db/transactions";

export const transactionsRouter = express.Router();

transactionsRouter
    .route('/')
    .get(requireLogin, async (req: Request, res: Response) => {
        const transactions = await getLatestTransactions(20);
        res.render('transactions/', {
            transactions
        });
    })
    .post(requireLogin, async (req: Request, res: Response) => {
        const id = Number(req.body.id);

        await delTransaction(id);

        res.redirect("/transactions");

        }
    );

transactionsRouter
    .route('/add')  
    .get(requireLogin, (req: Request, res: Response) => {
        res.render("transactions/add", {
            form_values: req.session.form_values ?? {},
            input_errors: req.session.input_errors ?? {},
            success_message: req.session.success_message ?? ''
        });
    })
    .post(requireLogin, async (req: Request, res: Response) => {
        if (!req.session.user_id) { throw new Error('No session userID'); }
  
            switch (await addTransaction(req.body.title, req.body.price, new Date(req.body.date), req.body.platform, req.body.reg_plate)) {
                case 'OK': {
                    req.session.success_message = 'Successfully added transaction.';
                    return res.redirect(req.originalUrl);
                }
                case 'CAR_NOT_FOUND': {
                req.session.input_errors ??= {};
                req.session.input_errors['reg_plate'] = 'Car registration not in database.';
                req.session.form_values = { ...req.body };
                return res.redirect(req.originalUrl)
            }}
        });

transactionsRouter
    .route('/edit')  
    .get(requireLogin, async (req: Request, res: Response) => {
        
        const transaction_id = req.query['transaction_id'];

        if (typeof transaction_id === "string") {
            const transaction = await getTransaction(transaction_id);
            if (transaction) {
                req.session.form_values = {
                    title: transaction.title,
                    price: String(transaction.price),
                    reg_plate: transaction.reg_plate,
                    date: transaction.date,
                    platform: String(transaction.platform)
                };
            }
        }

        res.render("transactions/edit", {
            form_values: req.session.form_values ?? {},
            input_errors: req.session.input_errors ?? {},
            success_message: req.session.success_message ?? ''
        });
    })
    .post(requireLogin, async (req: Request, res: Response) => {
        if (!req.session.user_id) { throw new Error('No session userID'); }
  
            switch (await editTransaction(req.body.transaction_id, req.body.title, req.body.price, new Date(req.body.date), req.body.platform, req.body.reg_plate)) {
                case 'OK': {
                    req.session.success_message = 'Successfully edited transaction.';
                    return res.redirect(req.originalUrl);
                }   
            }        
        }
    );