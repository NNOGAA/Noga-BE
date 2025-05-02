require('dotenv').config();
// FUNCTION
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');

// ROUTE
var imageRouter = require('./routes/image');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ROUTER
app.use('/api/image', imageRouter);

// UPLOAD
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listen to Port ${port}`);
})

module.exports = app;
