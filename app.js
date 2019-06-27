const express = require('express');
const mongoose = require("mongoose");

const app = express();

app.get('/',(req,res)=>{
  res.send("remah");
})

const port = process.env.PORT || 4000; // to open live

app.listen(port,()=>{
  console.log(`server started on port ${port}`);
})
