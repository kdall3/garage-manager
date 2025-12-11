import { Request, Response, NextFunction } from 'express';

export function requireLogin(req: Request, res: Response, next: NextFunction) {
    console.log(req.session)
    req.session.loggedIn = false;
    console.log(req.session)

    if (true) {
        return res.redirect('/login');
    }

    next();
}