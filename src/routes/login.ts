import express, { Request, Response, NextFunction } from "express";
import { checkPassword, getIdByUsername } from '../db/user';

export const loginRouter = express.Router();

loginRouter
    .route('/')
    .get((req: Request, res: Response) => {
        res.render('login', {
            form_values: req.session.form_values ?? {},
            input_errors: req.session.input_errors ?? {}
        });

        // Reset form session vars after we are done rendering them
        req.session.input_errors = {};
        req.session.success_message = '';
    })
    .post(async (req: Request, res: Response) => {
        switch (await checkPassword(req.body.username, req.body.password)) {
            case 'OK': {
                // Final user ID check
                const user_id = await getIdByUsername(req.body.username);
                if (user_id === null) {
                    req.session.input_errors ??= {};
                    req.session.input_errors['username'] = 'User ID not found';
                    req.session.form_values = { ...req.body };
                    return res.redirect("/");
                }

                // Set session variables
                req.session.user_id = user_id;

                // Redirect to original desired page (or homepage if none)
                const redirectTo = req.session.return_to_url || '/';
                delete req.session.return_to_url;
                return res.redirect(redirectTo);
            }
            case 'USER_NOT_FOUND': {
                req.session.input_errors ??= {};
                req.session.input_errors['username'] = 'User not found';
                req.session.form_values = { ...req.body };
                return res.redirect(req.originalUrl);
            }
            case 'INVALID_PASSWORD': {
                req.session.input_errors ??= {};
                req.session.input_errors['password'] = 'Password incorrect';
                req.session.form_values = { ...req.body };
                return res.redirect(req.originalUrl);
            }
        }
    });