const express = require('express');
// create http error for express 
const createError = require('http-errors');
// using async function with express
require('express-async-errors');
// for local enviroment
require('dotenv').config();
// middleware
const morgan = require('morgan');
// for parse body in http
const bodyParser = require('body-parser');
const cors = require('cors');

const authRouter = require('./src/auth/auth.route');
const userRouter = require('./src/user/user.route');
// require('ex')
const app = express();
// any request to server will be in console.log
app.use(morgan('dev'));

// allow other domain to access this api
app.use(cors());
//  Content-Type :application/x-www-form-urlencoded, transform req.body into object data extend = false to avoid nested object
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)
//  Content-Type :application/json, transform req.body into object data 
app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.send('App is running');
})

app.use('/auth', authRouter);
// app.use('/user', userRouter);
const server = app.listen(process.env.PORT_BACKEND || 3005, () => {
	console.log(`Express running → PORT ${server.address().port}`);
});