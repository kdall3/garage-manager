import express, { Request, Response, NextFunction } from "express";
import { requireLogin } from "../middleware/requireLogin";
import { getCars } from "../db/cars";
import { hoursPerCar } from "../db/hours";
import { getActiveTasks } from "../db/tasks";
import { toggleActive } from "../db/tasks";

export const dashboardRouter = express.Router();

dashboardRouter
    .route('/')
    .get(requireLogin, async (req: Request, res: Response) => {
        const cars = await getCars();
        const carsInStock = cars.filter(car => car.status !== 'Sold');
        const activeTasks = await getActiveTasks();
        const carHours = await hoursPerCar(req.session.user_id);

        res.render("dashboard", {
            carsInStock,
            carHours,
            activeTasks
        });
    })
    .post(requireLogin, async (req: Request, res: Response) => {
        const { task_id, active } = req.body;

        await toggleActive(
            Number(task_id),
            Boolean(active)
        );

        res.redirect(req.get("Referer") || "/");
        });