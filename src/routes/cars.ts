import express, { Request, Response, NextFunction } from "express";
import { requireLogin } from "../middleware/requireLogin";
import { getCars } from "../db/cars";
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
    });