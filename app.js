require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

// ROUTE
const imageRouter = require('./routes/image');

const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ROUTER
app.use('/api/image', imageRouter);

// STATIC FILES - UPLOAD
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
