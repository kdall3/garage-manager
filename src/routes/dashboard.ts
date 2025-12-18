import express, { Request, Response, NextFunction } from "express";
import { requireLogin } from "../middleware/requireLogin";
import { getCarsInStock } from "../db/cars";

export const dashboardRouter = express.Router();

dashboardRouter
    .route('/')
    .get(requireLogin, async (req: Request, res: Response) => {
        const cars = await getCarsInStock();

        res.render("dashboard", {
            cars
        });
    });