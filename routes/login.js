const express = require('express');

const router = express.Router();

function requireLogin(req, res, next) {
    if (!res.session.loggedIn) {
        return res.redirect('/login')
    }
    next();
}

router
    .route('/')
    .get((req, res) => {
        res.render('login');
    })
    .post((req, res, next) => {
        console.log(req.body);
        next();
    });

module.exports = router;