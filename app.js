const fs = require('fs');
const path = require(`path`);
const express = require('express');
const session = require('express-session');

// Check if .env exists
const envPath = path.resolve(__dirname, '.env');

if (fs.existsSync(envPath)) {
    require('dotenv').config();
} else {
    // Formatting string makes it red
    console.warn('\x1b[31m%s\x1b[0m', 'ERROR: .env file not found');
    throw new Error('.env file not found');
}

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