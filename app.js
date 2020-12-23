const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv/config')

const app = express();

const userRoutes = require('./api/routes/user');
const uploadRoutes = require('./api/routes/upload');
const deleteRoutes = require('./api/routes/delete');

mongoose.connect(`mongodb+srv://anil:${process.env.MONGO_ATLAS_PW}@cluster0.pmkwx.mongodb.net/Cluster0?retryWrites=true&w=majority`, { useNewUrlParser: true })

// middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// routes which should handle request
app.use("/user", userRoutes);
app.use("/upload", uploadRoutes);
app.use("/delete", deleteRoutes);


// error handling 
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
})

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;