
const methodOverride = require('method-override')
const session = require('express-session')
const bodyParser = require("body-parser")
const flash = require('connect-flash')
const Routes = require("./routes.js")
const mongoose = require('mongoose')
const ejsMate = require("ejs-mate")
const express = require('express')
const app = express()


const sessionConfig = {
  saveUninitialized: true,
  secret: 'thissecret',
  resave: false,
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
app.use(flash())


app.use((req, res, next) => {
  res.locals.success = req.flash("success")
  res.locals.error = req.flash("error")
  next()

})





app.use("/", Routes)









mongoose.connect('mongodb://localhost:27017/camp_website', {
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

