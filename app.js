const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const requireLogin = require('./routes/login')

const app = express();
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

console.log(app.get('views'));

app
    .route('/')
    .get(requireLogin, (req, res) => {
        res.send("WE ARE IN");
    })

const login_router = require('./routes/login');
app.use('/login', login_router);

app.listen(3000);