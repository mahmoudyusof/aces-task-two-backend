const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const auth = require('./middleware/auth');


mongoose
  .connect ('mongodb://localhost/tasktwo', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then (() => console.log ('Connected to database.'))
  .catch (err => console.log (err));


// define app
const app = express();

// use middlewares
app.use(express.json());

// require routes
const usersRouter = require('./routes/users.js');
const main = require('./routes/main');

// use routes
app.use('/api/auth', usersRouter);
app.use('/api', auth, main);

// listen
app.listen(config.get("PORT"), () => console.log(`listening on localhost:${config.get("PORT")}...`));
