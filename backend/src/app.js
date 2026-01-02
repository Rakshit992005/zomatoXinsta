// create server
const express = require('express')
const cookieParser = require("cookie-parser")
const authRoutes = require('./routes/auth.routes.js')

const app = express();
app.use(express.json());  //midleware used to read data comming form frontend
app.use(cookieParser());


app.get("/" , (req , res) =>{
    res.send("hello world")
})

app.use('/api/auth' , authRoutes)

module.exports = app;