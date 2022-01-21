const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const app = express();
const cors = require('cors');
const knex = require('knex');
const dotenv = require('dotenv').config('./.env');
const register = require('./controllers/register.js');
const signin = require('./controllers/signin.js');
const profile = require('./controllers/profile.js');
const image = require('./controllers/image.js');

const postgres = knex({
    client: process.env.CLIENT,
    connection: {
        host: process.env.HOST,
        port: process.env.PORT,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
    },
    pool: {
        min: 0,
        max: 10,
        createTimeoutMillis: 3000,
        acquireTimeoutMillis: 30000,
        idleTimeoutMillis: 30000,
        reapIntervalMillis: 1000,
        createRetryIntervalMillis: 100,
        propagateCreateError: false
    },
    acquireConnectionTimeout: 10000
});

//line of code below replaces using bodyParser
app.use(express.json());
app.use(cors());
app.get('/', (req, res) => {
   res.json('MUCH SUCCESS');
});

app.post('/signin', (req, res) => { signin.handleSignIn(req, res, postgres, bcrypt) });
app.post('/register', (req, res) => { register.handleRegister(req, res, postgres, bcrypt) }); //inject your dependencies into your controller
app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res, postgres) });
app.put('/image', (req, res) => { image.handleImage(req, res, postgres) });
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) });
app.listen(process.env.SERVER_PORT, () => {
    console.log('app is running on PORT 3001');
});

/*
/ --> res = return this is working
/signin --> POST = return success/fail
/register --> POST = return new user
/profile/:userId --> GET = return user


*/