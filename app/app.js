const mongoSanitize = require('express-mongo-sanitize');
const methodOverride = require('method-override')
const localStrategy = require("passport-local")
const session = require('express-session')
const bodyParser = require("body-parser")
const User = require("../models/user.js")
const flash = require('connect-flash')
const Routes = require("./routes.js")
const mongoose = require('mongoose')
const passport = require("passport")
const ejsMate = require("ejs-mate")
const express = require('express')
const app = express()   


const MongoStore = require('connect-mongo')(session);


// env
require('dotenv').config()
const dbUrl = process.env.DB_URL


const store = new MongoStore ({
  url: dbUrl ,
  touchAfter: 24 * 60 * 60,
  secret: "thisissecret"
})

store.on("eroor", (e) => {
  console.log("Seessions eroor", e)
})

// express-session 
const sessionConfig = {
  saveUninitialized: true,
  secret: 'thissecret',
  resave: false,
  name: "session",
  store,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true
  }
}




app.use(bodyParser.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(session(sessionConfig))
app.set('view engine', 'ejs')
app.engine("ejs", ejsMate)
app.use(mongoSanitize())
app.use(flash())


// passport
passport.use(new localStrategy(User.authenticate()))
passport.deserializeUser(User.deserializeUser())
passport.serializeUser(User.serializeUser())
app.use(passport.initialize())
app.use(passport.session())



// flash
app.use((req, res, next) => {
  res.locals.success = req.flash("success")
  res.locals.error = req.flash("error")
  res.locals.currentUser = req.user
  next()
})





app.use("/", Routes)







mongoose.connect( 
  dbUrl, {
  useUnifiedTopology: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useCreateIndex: true, 
}, (err, result) => {
  if(err) {
    console.log(err)
  } else {
    console.log("DATABASE connected")
  }
});









app.listen(3000, () => {
  console.log("server has started")
})

