require('dotenv').config()
var express=require("express"); 
const router=express.Router();
var app=express();
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');
var regInfo=require('./models/Register.js');
var bodyparser = require('body-parser')
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
var sessions = require('express-session');
var session = require('sessionstorage');





// Body-parser middleware 
app.use(bodyparser.urlencoded({extended:false})) 
app.use(bodyparser.json()) 


   

//home
router.get('/',(req,res)=>{
   res.render('pages/home')
})
// router.get('/home',(req,res)=>{
//    res.render('pages/home')
// })

//register get 
router.get('/register',function (req, res) {
    var result;
    regInfo.find({},function(err,result){
   //   console.log(result,'true')
    res.render('pages/register',{result:result});

  });
});

//register  post
router.post('/register',function(req,res){
    
    var password = req.body.password;

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
         if (err) throw err
         const passwordhash = hash;

   var user= new regInfo({
       name    : req.body.name,
       mobile  : req.body.mobile,
       email   : req.body.email,
       password :passwordhash,
       
     });

     user.save(function(err,result){
        if(err){
           console.log('error')
        }else{
           res.redirect('/login')
        }
    
 })

      });
   });
 
   });
//login get
router.get('/login',function (req, res) {
    var result;
    regInfo.find({},function(err,result){
   //   console.log(result,'true')
      //var id = req.session.sessionkey
    res.render('pages/login',{result:result});

  });
});
//login post
router.post('/login',function(req,res){
   //  console.log(req.body.password,'ghghfghghgf');
      


      
      regInfo.find({name:req.body.name},(err,result)=>{
      //   console.log(result,'resulttttttt')
     

         if(!result){
            res.json({ message: 'gdfddhdf',result:result})
         }
         else
         {
            console.log(req.body.password,'user pwd')
            console.log(result[0].password,'db pwd')
            bcrypt.compare(req.body.password, result[0].password, function(err, result) {
               // result == true

                console.log(result,'password')

            if(result){
               const secret = 'SECRET MESSAGE';
               const token = jwt.sign({ 'user_id': result }, secret, { expiresIn: '1h' });
                 console.log(token,'tokennnnnnnnn')
              
                 session.setItem("sessionkey",token)
               
                 console.log(session.getItem('sessionkey'),'session key------------------')
                        
                 res.redirect('/dashboard')
              
            }
            else{
               console.log(err)
            }  
         });
         } 
   })
    });
   
    //dashboard 
    router.get('/dashboard',function (req, res) {
      var result;
      regInfo.find({},function(err,result){
     //   console.log(result,'true')
    
      res.render('pages/dashboard',{result:result});
                      
    });
  });

//logout
router.get('/logout',function(req,res){
   // delete req.session.userid;
   req.session.destroy()
   res.redirect('/');

   });

module.exports=router;




