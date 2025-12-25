import express, { Request, Response, NextFunction } from "express";
import { requireLogin } from "../middleware/requireLogin";
import { getCarsInStock } from "../db/cars";
import { hoursPerCar } from "../db/hours";

export const dashboardRouter = express.Router();

dashboardRouter
    .route('/')
    .get(requireLogin, async (req: Request, res: Response) => {
        const cars = await getCarsInStock();
        const carHours = await hoursPerCar();
        

        res.render("dashboard", {
            cars,
            carHours
        });
    });