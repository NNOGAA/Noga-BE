require('dotenv').config();
// FUNCTION
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');

// ROUTE
// var indexRouter = require('./routes/index');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ROUTER
// app.use('/users', usersRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listen to Port ${port}`);
})

module.exports = app;
