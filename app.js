const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const signale = require('signale-logger');
const swagger = require('swagger-ui-express')
const swaggerDoc = require('./swaggerDoc.json')
const dotenv = require('dotenv');

dotenv.config();
const env = process.env.NODE_ENV || 'dev';
const port = process.env.PORT || 3000;
const host = process.env.HOST || "127.0.0.1";
const apiBasePath = '/expense-app';

app.use(cors({origin: '*'}));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use(`${apiBasePath}/api-docs`, swagger.serve, swagger.setup(swaggerDoc));

// routes
const expensesAPI = require('./routes/expense.routes');
app.use(`${apiBasePath}`, expensesAPI);

// mongodb connection
const MONGO_URL = process.env.DB_URI ? process.env.DB_URI : `mongodb+srv://${process.env.DB_username}:${process.env.DB_password}@${process.env.DB_cluster}.mongodb.net/${process.env.DB_database}`

mongoose.connect(MONGO_URL, { 
              useNewUrlParser: true,  
              useUnifiedTopology: true, 
              useFindAndModify: false })
        .then(()=> signale.info(`MongoDB connected to database : ${process.env.DB_database}`))
        .catch(err => 'Connection with MongoDB Failed: ' + err);

// server
app.listen(port, host, () => {
 signale.debug("NODE_ENV : ", env);
 signale.info(`App running on http://${host}:${port}`);
});

app.get('/',(req, res, next) => {
  res.status(200).send({ "msg": 'Go to /expense-app path' });
});

// Uncaught Exception Handler
process.on('uncaughtException', function (err) {
  signale.error('Exception : ' + err.stack);
});

// Uncaught Promise rejection Handler
process.on('unhandledRejection', function (err) {
  signale.error('Exception : ' + err.stack);
});

app.use((err, req, res, next) => {
  signale.error("Error validating the request parameters : ", req.body)
  res.status(400).json(err);
});

module.exports = app;