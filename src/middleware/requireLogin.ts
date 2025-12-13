import { Request, Response, NextFunction } from 'express';

export function requireLogin(req: Request, res: Response, next: NextFunction) {
    if (!req.session.user_id) {
        req.session.return_to_url = req.originalUrl;
        return res.redirect(`/login`);
    }

    next();
}