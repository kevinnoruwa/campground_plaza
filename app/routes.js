const mapBoxToken = "pk.eyJ1Ijoia2V2bGl2ZSIsImEiOiJja2hreHNpN3AwdW8xMnhwZmNmemdjdWV0In0.CU-UA0lRN23uVgf3PuZnZA"
const {validateCampground, validateReview} = require("../middleware/validate.js")
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })
const ExpressError = require("../utils/expressError")
const {isLoggedIn} = require("../middleware/auth.js")
const Campground = require("../models/campground.js")
const catchAsyc = require("../utils/catchAsynch")
const Review = require("../models/review.js")
const User = require("../models/user.js")
const passport = require("passport")
const express = require("express")
const route = express.Router()




route.get("/", (req, res) => {
    res.render("home.ejs")
  })
  
  
  
//   home
  route.get("/campgrounds",catchAsyc( async (req, res, next) => {
      const campgrounds =   await Campground.find({})
      res.render("campgrounds/index.ejs", {campgrounds})
  }))


//   create 
  route.get("/campgrounds/new",isLoggedIn,catchAsyc( async (req, res) => {
    res.render("campgrounds/new.ejs")
  }))
  
//   post

route.post('/campgrounds',isLoggedIn,validateCampground, catchAsyc ( async (req,res) => {
  const geoData = await  geocoder.forwardGeocode({
    query: req.body.campground.location,
    limit: 1
  }).send()
  const campground =  new Campground(req.body.campground)
  campground.geometry = geoData.body.features[0].geometry
  campground.author = req.user._id
  await  campground.save()
  req.flash('success', 'Successfully made a new campground')
  res.redirect(`/campgrounds/${campground._id}`)

}))

  
//   show 
  route.get("/campgrounds/:id", catchAsyc( async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate("reviews").populate("author")
    if(!campground) {
      req.flash("error", 'Cannot find that campground')
      return  res.redirect("/campgrounds")
    }
    res.render("campgrounds/show.ejs", {campground})
  }))

//   edit 

route.get("/campgrounds/:id/edit", isLoggedIn, catchAsyc ( async (req, res) => {
  const campground = await Campground.findById(req.params.id)
  if(!campground) {
    req.flash("error", 'Cannot find that campground')
    return  res.redirect("/campgrounds")
  }
  res.render("campgrounds/edit.ejs", {campground})
}))

// update

route.put("/campgrounds/:id",validateCampground, catchAsyc ( async (req, res)  =>{
  const campground =   await Campground.findByIdAndUpdate(req.params.id, {...req.body.campground} )
  await campground.save()
  req.flash('success', 'Campground Updated')
  res.redirect(`/campgrounds/${req.params.id}`)
}))


// delete 

route.delete("/campgrounds/:id", isLoggedIn, catchAsyc ( async (req, res) => {
  const campground = await Campground.findByIdAndDelete(req.params.id)
  req.flash('success', 'Campground Deleted')
  res.redirect("/campgrounds")

}))

// Campground reviews

route.post("/campgrounds/:id/reviews",validateReview, catchAsyc( async(req, res) => {
  const campground = await Campground.findById(req.params.id)
  const review = new Review(req.body.review)
  campground.reviews.push(review)
  await review.save()
  await campground.save()
  res.redirect("back")



}))




route.delete("/campgrounds/:id/reviews/:reviewId", catchAsyc( async (req, res) => {
  const {id, reviewId} = req.params
  await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId }})
  await  Review.findByIdAndDelete(reviewId)
  res.redirect(`/campgrounds/${id}`)
}))




//  register

route.get("/register", (req, res) => {
  res.render("users/register.ejs")
} )



route.post("/register", catchAsyc( async (req, res, next) => {
  try {
    const {email, username, password} = req.body
    const user = new User({email, username, password})
    const registeredUser = await User.register(user, password )
    req.login(registeredUser, (err) => {
      if(err) return next(err)
        req.flash("success", 'Welcome to yelp camp!')
        res.redirect("/campgrounds")
    })
  
  } catch(e) {
      req.flash("error", e.message)
      res.redirect("/register")
  }
  
 
}))




// log in 

route.get('/login', (req, res) => {
    res.render("users/login.ejs")
})


route.post('/login',passport.authenticate('local', {failureFlash:true, failureRedirect:'/login'}),(req, res) => {
  req.flash('success', 'welcome back!')
  res.redirect("/campgrounds")
})



// log out 

route.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Goodby!" )
  res.redirect("/campgrounds")

})


route.all('*', (req, res, next) => {
  next(new ExpressError('page not found', 404))
 

})


route.use((err, req, res, next) => {
  const {statusCode = 500} = err
  if(!err.message) {
    err.message = "something went wrong"
  }
  res.status(statusCode).render("error.ejs", {err})

})


  




  module.exports = route