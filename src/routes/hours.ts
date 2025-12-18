import express, { Request, Response, NextFunction } from "express";
import { requireLogin } from "../middleware/requireLogin";
import { addShift } from "../db/hours";
import { getShiftsOnDate } from "../db/hours";

export const hoursRouter = express.Router();
hoursRouter.use(requireLogin);

hoursRouter.route('/')
    .get(async (req: Request, res: Response) => {
        // Get date GET argument
        const date_str = req.query['date'] as string
        let date: Date | null = null;

        // Parse date if exists
        if (date_str) {
            date = new Date(date_str)
            if (isNaN(date.getTime())) { date = null; }
        } else {
            const date = new Date(); // today's date

            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-based
            const dd = String(date.getDate()).padStart(2, '0');

            return res.redirect(`/hours/?date=${yyyy}-${mm}-${dd}`)
        }

        // Get shifts if we have a date
        let shift_list = null;
        if (!date) { date = new Date() }
        if (date) {
            shift_list = await getShiftsOnDate(date);
        }

        res.render('hours', {
            form_values: req.session.form_values ?? {},
            input_errors: req.session.input_errors ?? {},
            shift_list,
            date
        });

        // Delete form session vars after we are done rendering them
        delete
            req.session.input_errors,
            req.session.success_message
    })

hoursRouter.route('/add')
    .get((req: Request, res: Response) => {
        res.render('hours/add', {
            form_values: req.session.form_values ?? {},
            input_errors: req.session.input_errors ?? {},
            success_message: req.session.success_message ?? ''
        });

        // Reset form session vars after we are done rendering them
        delete req.session.input_errors, req.session.success_message;
    })
    .post(async (req: Request, res: Response) => {
        if (!req.session.user_id) { throw new Error('No session userID'); }

        switch (await addShift(req.session.user_id, req.body.reg_plate, new Date(req.body.start_time), new Date(req.body.end_time), req.body.notes)) {
            case 'OK': {
                req.session.success_message = 'Successfully added shift.';
                return res.redirect(req.originalUrl);
            }
            case 'CAR_NOT_FOUND': {
                req.session.input_errors ??= {};
                req.session.input_errors['reg_plate'] = 'Car registration not in database.';
                req.session.form_values = { ...req.body };
                return res.redirect(req.originalUrl);
            }
            case 'EMPLOYEE_NOT_FOUND': {
                req.session.input_errors ??= {};
                req.session.input_errors['end_time'] = 'Logged in user\'s ID not in database';
                req.session.form_values = { ...req.body };
                return res.redirect(req.originalUrl);
            }
            case "WRONG_DATE_ORDER": {
                req.session.input_errors ??= {};
                req.session.input_errors['end_time'] = 'End time cannot be before start time';
                req.session.form_values = { ...req.body };
                return res.redirect(req.originalUrl);
            }
        }
    })