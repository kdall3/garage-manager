import express, { Request, Response, NextFunction } from "express";
import { requireLogin } from "../middleware/requireLogin";
import { getCars } from "../db/cars";
import { addCar } from "../db/cars";
import { hoursPerCar } from "../db/hours";

export const carsRouter = express.Router();

carsRouter
    .route('/')
    .get(requireLogin, async (req: Request, res: Response) => {
        const cars = await getCars();
        const carHours = await hoursPerCar();
        
        res.render("cars", {
            cars,
            carHours
        });
    })

carsRouter
    .route('/add')
    .get(requireLogin, async (req: Request, res: Response) => {
        
        res.render("cars/add", {
            form_values: req.session.form_values ?? {},
            input_errors: req.session.input_errors ?? {},
            success_message: req.session.success_message ?? ''
        });
    })
    .post(async (req: Request, res: Response) => {
        if (!req.session.user_id) { throw new Error('No session userID'); }

        switch (await addCar(req.body.reg_plate, req.body.make, req.body.model, req.body.year, req.body.mileage, req.body.colour, req.body.damage, req.body.description, req.body.status, req.body.buy_price, req.body.platform, new Date(req.body.buy_date))) {
            case 'OK': {
                req.session.success_message = 'Successfully added car.';
                return res.redirect(req.originalUrl);
            }
            case 'CAR_ALREADY_EXISTS': {
                req.session.input_errors ??= {};
                req.session.input_errors['reg_plate'] = 'Car registration already exists in database.';
                req.session.form_values = { ...req.body };
                return res.redirect(req.originalUrl);
            }
        }}
    );