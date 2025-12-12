import express, { Request, Response, NextFunction } from "express";
import { checkPassword } from '../db/user';

export const loginRouter = express.Router();

loginRouter
    .route('/')
    .get((req: Request, res: Response) => {
        res.render('login', {
            form_values: req.session.form_values ?? {},
            input_errors: req.session.input_errors ?? {}
        });

        // Reset input errors after we are done rendering them
        req.session.input_errors = {};
    })
    .post(async (req: Request, res: Response) => {
        switch (await checkPassword(req.body.username, req.body.password)) {
            case 'OK': {
                req.session.loggedIn = true;
                return res.redirect("../");
            }
            case 'USER_NOT_FOUND': {
                req.session.input_errors ??= {};
                req.session.input_errors['username'] = 'User not found';
                req.session.form_values = { ...req.body };
                return res.redirect("/");
            }
            case 'INVALID_PASSWORD': {
                req.session.input_errors ??= {};
                req.session.input_errors['password'] = 'Password incorrect';
                req.session.form_values = { ...req.body };
                return res.redirect("/");
            }
        }
    });