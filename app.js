const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv  = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const User = require('./models/user');

let saltRounds = 10;


app.use(bodyParser.urlencoded({
    extended:true
}));

app.get('/home/:token',async (req,res)=>{
    const p_token = req.params.token;
    
    jwt.verify(p_token,process.env.secret,(err,decoded)=>{
        if(err) res.send("Unable to verify");
        res.send(decoded);
    })
});
//signup
app.route('/signup')
    .get((req,res)=>{
        res.send("Sign up Page");
    })
    .post((req,res)=>{
    const {name , username , password, role} = req.body;
    //hashing password
    bcrypt.hash(password, saltRounds)
    .then(function(hash) {
        new User({name : name,userName : username,password : hash,role : role})
        .save()
        .then((result)=>{ console.log("Created new User"); res.redirect('/login'); })
        .catch((err)=>{console.log(err); res.send("Unable to create new user");    });
    })
    .catch((err)=>{ console.log("Run into bcrypt error \n"); console.log(err); });
});
//login
app.route('/login')
    .get((req,res)=>{
    console.log("get route Login");
    res.send("Login Page");
    })
    .post((req,res)=>{
    const {username, password} = req.body;
    User.findOne({userName : username})
    .then((user)=>{
        bcrypt.compare(password, user.password)
                        .then((result)=> {
                            if(result){
                                jwt.sign({user},process.env.secret,(err,token)=>{
                                    console.log(token);
                                    res.redirect('/home/'+token+'');
                                    // res.send(token);
                                   });
                            }                
                        }).catch((err)=>console.log(err));
    })
    .catch((err)=>{
        console.log(err);
    });
});

//Server and databas connection
mongoose.connect('mongodb://127.0.0.1:27017/nature',{
    useNewUrlParser:true,
    useUnifiedTopology : true
})
    .then(
        ()=>{
            console.log("Database is  connected");
            app.listen(process.env.PORT,(err)=>{
                if(!err) console.log("Server is running on "+ process.env.PORT);
            });
    })
    .catch(
    (err)=>{ 
        console.log(err);
        console.log("Not connected to server");}
    );
  