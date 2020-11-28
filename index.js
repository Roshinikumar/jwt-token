const express = require("express")
const app = express();
const mongoose = require("mongoose")
const infoRouter = require("./router");
var path = require("path");
var bodyparser = require('body-parser')
var session = require('express-session');
// Body-parser middleware 
app.use(bodyparser.urlencoded({extended:false})) 
app.use(bodyparser.json()) 

//view engine
app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'ejs');

app.use(session({
    secret: "it is my secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
    maxAge: 300000
    }
    }));

//DB connection
mongoose.connect("mongodb://localhost:27017/user", { useNewUrlParser: true,useUnifiedTopology: true },(err)=>{
    if(!err){
        console.log("connected successfully")
    } else{
        console.log("not connected")
    }
})

app.use(async function (req, res, next) {
    res.locals = {};
    res.locals.session = req.session;
    // console.log('res.locals : ',res.locals);
    next();
  });

//router initialization
app.use("/",infoRouter)


//listen port
app.listen(5000,()=>{
    console.log("server started")
})