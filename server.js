if(process.env.NODE_ENV !== 'production')
{
    require('dotenv').config()
}

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const bodyparser = require('body-parser')

const initializePassport = require('./passport-config')
initializePassport(
    passport,
    email => User.findOne(users => users.email === email),
    id => User.findOne(users => users.id === id)
    )


//connection to mongodb
const connectDb = require('./Db/connection');
const User= require('./Db/User');
connectDb();


// const users = []

app.set('view-engine', 'ejs')
app.use(express.urlencoded({extend:true}))
app.use(bodyparser.json())
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized:false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/', checkAuthenticated, (req,res) => {
    res.render('Dashboard.ejs', {name: req.user.name,
                                 email:req.user.email,
                                 regesterno:req.user.regesterno
    })
})


app.get('/login', checkNotAuthenticated, (req,res) => {
    res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash:true
}) )


app.get('/register',checkNotAuthenticated, (req,res) =>{
    res.render('register.ejs')
})

app.post('/register',checkNotAuthenticated, async (req,res) =>{
    try
    {
        // const hashedPassword = await bcrypt.hash(req.body.password,10)
        // users.push({
        //     id:Date.now().toString(),
        //     name:req.body.name,
        //     email:req.body.email,
        //     password:hashedPassword
        // })
        // res.redirect(('/login'))
    console.log(req.body);
	const hashedPassword = await bcrypt.hash(req.body.password,10)
	const{id,name,email,regesterno,password} = req.body;
    let users ={};
    // users.id = Date.now().toString()
	users.name = name;
    users.email = email;
    users.regesterno = regesterno;
	users.password = hashedPassword;
	let userModel = new User(users);
	await userModel.save();
	//res.json('userModel');
	//res.send("succesfull Register");
	res.redirect(('/login'))
    }
    catch
    {
        res.redirect('/register')
    }
    // console.log(users)
})


// logout
app.delete('/logout', (req,res) => {
    req.logOut()
    res.redirect('/login')
})


function checkAuthenticated(req, res, next)
{
    if(req.isAuthenticated())
    {
        return next()
    }
    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next)
{
    if(req.isAuthenticated())
    {
        return res.redirect('/')
    }
    next()
}

app.listen(3000)