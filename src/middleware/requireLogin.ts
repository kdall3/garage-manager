import { Request, Response, NextFunction } from 'express';

export async function requireLogin(req: Request, res: Response, next: NextFunction) {
    if (!req.session.loggedIn) {
        return res.redirect('/login');
    }

    next();
}