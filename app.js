const express = require('express');
const mongoose = require("mongoose");
const passport = require('passport');

// passport config
require('./config/passport')(passport); // pass module passport to file passport

// Load routes
const auth = require('./routes/auth');

const app = express();

app.get('/',(req,res)=>{
  res.send("remah");
})

// use routes
app.use('/auth',auth);

const port = process.env.PORT || 50000; // to open live , in heroku it 4000

app.listen(port,()=>{
  console.log(`server started on port ${port}`);
})
