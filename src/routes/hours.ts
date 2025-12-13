import express, { Request, Response, NextFunction } from "express";
import { requireLogin } from "../middleware/requireLogin";
import { addShift } from "../db/hours";

export const hoursRouter = express.Router();

hoursRouter.get('/', (req: Request, res: Response) => {
    res.redirect('/hours/add');
})

hoursRouter
    .route('/add')
    .get(requireLogin, (req: Request, res: Response) => {
        res.render('hours/add', {
            form_values: req.session.form_values ?? {},
            input_errors: req.session.input_errors ?? {},
            success_message: req.session.success_message ?? ''
        });

        // Reset form session vars after we are done rendering them
        req.session.input_errors = {};
        req.session.success_message = '';
    })
    .post(requireLogin, async (req: Request, res: Response) => {
        if (!req.session.user_id) { throw new Error('No session userID'); }

        switch (await addShift(req.session.user_id, req.body.reg_plate, new Date(req.body.start_time), new Date(req.body.end_time))) {
            case 'OK': {
                req.session.success_message = 'Successfully added shift.';
                return res.redirect(req.originalUrl);
            }
            case 'CAR_NOT_FOUND': {
                req.session.input_errors ??= {};
                req.session.input_errors['reg_plate'] = 'Car registration not in database.';
                req.session.form_values = { ...req.body };
                return res.redirect(req.originalUrl)
            }
            case 'EMPLOYEE_NOT_FOUND': {
                req.session.input_errors ??= {};
                req.session.input_errors['end_time'] = 'Logged in user\'s ID not in database';
                req.session.form_values = { ...req.body };
                return res.redirect(req.originalUrl)
            }
            case "WRONG_DATE_ORDER": {
                req.session.input_errors ??= {};
                req.session.input_errors['end_time'] = 'End time cannot be before start time';
                req.session.form_values = { ...req.body };
                return res.redirect(req.originalUrl)
            }
        }
    })