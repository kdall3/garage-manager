import express, { Request, Response, NextFunction } from "express";
import { requireLogin } from "../middleware/requireLogin";
import { carProfitLossByReg } from "../db/transactions";
import { getCars } from "../db/cars";
import { getCarFromReg } from "../db/cars";
import { addCar } from "../db/cars";
import { editCarDetails } from "../db/cars";
import { getInStock } from "../db/cars";
import { sellCar } from "../db/cars";
import { hoursPerCar } from "../db/hours";
import { hoursPerEmployee } from "../db/hours";

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
        
        const cars = await getInStock();

        res.render("cars/add", {
            cars,
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

carsRouter
    .route('/:reg_plate/edit')
    .get(requireLogin, async (req: Request, res: Response) => {

        req.session.form_values ??= {};

        const regPlate = req.params['reg_plate'];

        if (typeof regPlate === "string") {
            const car = await getCarFromReg(regPlate);
            if (car) {
                req.session.form_values = {
                reg_plate: car.reg_plate,
                make: car.make,
                model: car.model,
                year: String(car.year),
                mileage: String(car.mileage),
                colour: String(car.colour),
                damage: car.damage ?? "",
                description: car.description ?? "",
                status: car.status
                };
            }
        }
        
        const cars = await getInStock();
        
        res.render("cars/edit", {
            cars,
            form_values: req.session.form_values ?? {},
            input_errors: req.session.input_errors ?? {},
            success_message: req.session.success_message ?? ''
        });
    })
    .post(async (req: Request, res: Response) => {
        if (!req.session.user_id) { throw new Error('No session userID'); }

        switch (await editCarDetails(req.body.reg_plate, req.body.make, req.body.model, req.body.year, req.body.mileage, req.body.colour, req.body.damage, req.body.description, req.body.status)) {
            case 'OK': {
                req.session.success_message = 'Successfully edited car.';
                return res.redirect(req.originalUrl);
            }
            case 'CAR_DOESNT_EXIST': {
                req.session.input_errors ??= {};
                req.session.input_errors['reg_plate'] = 'Car registration doesnt exist in database.';
                req.session.form_values = { ...req.body };
                return res.redirect(req.originalUrl);
            }
        }}
    );

carsRouter
    .route('/:reg_plate/sell')
    .get(requireLogin, async (req: Request, res: Response) => {

        req.session.form_values ??= {};

        if (typeof req.params['reg_plate'] === 'string') {
            req.session.form_values['reg_plate'] = req.params['reg_plate'];
        }
        
        const cars = await getInStock();

        res.render("cars/sell", {
            cars,
            form_values: req.session.form_values ?? {},
            input_errors: req.session.input_errors ?? {},
            success_message: req.session.success_message ?? ''
        });
    })
    .post(async (req: Request, res: Response) => {
        if (!req.session.user_id) { throw new Error('No session userID'); }

        switch (await sellCar(req.body.reg_plate, req.body.price, req.body.plaform, req.body.date)) {
            case 'OK': {
                req.session.success_message = 'Successfully edited car.';
                return res.redirect(req.originalUrl);
            }
            case 'CAR_DOESNT_EXIST': {
                req.session.input_errors ??= {};
                req.session.input_errors['reg_plate'] = 'Car registration doesnt exist in database.';
                req.session.form_values = { ...req.body };
                return res.redirect(req.originalUrl);
            }
        }}
    );



carsRouter
    .route("/:reg_plate/hours")    
    .get(requireLogin, async (req: Request, res: Response) => {

    const cars = await getCars();
    const carHours = await hoursPerCar();

    const { reg_plate } = req.params;
    
    if (typeof reg_plate === 'string') {
        const hoursWorked = await hoursPerEmployee(reg_plate);

        res.render("cars/hours-stats", {
            reg_plate,
            hoursWorked
        });
    } else {
        res.render("cars", {
            cars,
            carHours
        });
    }
  }
);

carsRouter
    .route("/:reg_plate")    
    .get(requireLogin, async (req: Request, res: Response) => {

    const regPlate = req.params['reg_plate'];

    if (!regPlate) {
        return res.status(400).send("Missing reg plate");
    }

    const car = await getCarFromReg(regPlate);
    if (!car) {
      return res.status(404).render("404");
    }

    const profitLoss = await carProfitLossByReg(regPlate);
    const hoursWorked = await hoursPerCar();

    res.render("cars/stats", {
      car,
      profitLoss,
      hoursWorked
    });
  }
);