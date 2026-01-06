import express, { Request, Response, NextFunction } from "express";
import { requireLogin } from "../middleware/requireLogin";
import { getAllTasks } from "../db/tasks";
import { toggleActive } from "../db/tasks";
import { addTask } from "../db/tasks";
import { getInStock } from "../db/cars";

export const tasksRouter = express.Router();

tasksRouter
    .route('/')
    .get(requireLogin, async (req: Request, res: Response) => {
        const activeTasks = await getAllTasks();

        res.render("tasks", {
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

tasksRouter
    .route('/add')
    .get(requireLogin, async (req: Request, res: Response) => {

        const cars = await getInStock();

        res.render("tasks/add", {
            cars,
            form_values: req.session.form_values ?? {},
            input_errors: req.session.input_errors ?? {},
            success_message: req.session.success_message ?? ''
        });
    })
    .post(requireLogin, async (req: Request, res: Response) => {
        if (!req.session.user_id) { throw new Error('No session userID'); }

        switch (await addTask(req.body.task, req.body.reg_plate, req.body.priority)) {
            case 'OK': {
                req.session.success_message = 'Successfully added task.';
                return res.redirect(req.originalUrl);
            }
        }
    });
    