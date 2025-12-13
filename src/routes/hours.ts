import express, { Request, Response, NextFunction } from "express";
import { requireLogin } from "../middleware/requireLogin";
import { Request } from 'express';

export const hoursRouter = express.Router();

hoursRouter.get('/', (req: Request, res: Response) => {
    res.redirect('hours/add');
})

hoursRouter
    .route('/add')
    .get(requireLogin, (req: Request, res: Response) => {
        res.render('hours/add', {
            form_values: req.session.form_values ?? {},
            input_errors: req.session.input_errors ?? {}
        });

        // Reset input errors after we are done rendering them
        req.session.input_errors = {};
    })
    .post(requireLogin, (req: Request, res: Response) => {
        
    })