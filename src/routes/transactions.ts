import express, { Request, Response, NextFunction } from "express";
import { requireLogin } from "../middleware/requireLogin";

export const transactionsRouter = express.Router();

transactionsRouter
    .route('/')
    .get(requireLogin, (req: Request, res: Response) => {
        res.render('transactions/transactions', {
        });
    })
        

// transactionsRouter
//     .route('/add')
//     .get(requireLogin, (req: Request, res: Response) => {
//         res.render('transactions/add', {
//             form_values: req.session.form_values ?? {},
//             input_errors: req.session.input_errors ?? {},
//             success_message: req.session.success_message ?? ''
//         });

//         // Reset form session vars after we are done rendering them
//         req.session.input_errors = {};
//         req.session.success_message = '';
//     })
//     .post(requireLogin, async (req: Request, res: Response) => {})