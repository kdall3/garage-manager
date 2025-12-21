import express, { Request, Response } from "express";
import session from "express-session";

import { requireLogin } from './middleware/requireLogin';
import { config } from "./config/env";

const app = express();
app.set('view engine', 'ejs');

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}))

app.get("/", requireLogin, (_: Request, res: Response) => {
    res.redirect('/dashboard');
})

import { loginRouter } from './routes/login';
app.use('/login', loginRouter);

import { hoursRouter } from './routes/hours';
app.use('/hours', hoursRouter);

import { transactionsRouter } from './routes/transactions';
app.use('/transactions', transactionsRouter);

import { dashboardRouter } from './routes/dashboard';
app.use('/dashboard', dashboardRouter);


app.listen(3000);