
const {validateCampground, validateReview} = require("../middleware/validate.js")
const {message , statusCode} = require("../utils/expressError")
const ExpressError = require("../utils/expressError")
const Campground = require("../models/campground.js")
const catchAsyc = require("../utils/catchAsynch")
const Review = require("../models/review.js")
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
  route.get("/campgrounds/new", catchAsyc( async (req, res) => {
    res.render("campgrounds/new.ejs")
  }))
  
//   post

route.post("/campgrounds", validateCampground , catchAsyc( async(req, res, next) => { 
  const campground =  new Campground(req.body.campground)
  await  campground.save()
  req.flash('success', 'Successfully made a new campground')
  res.redirect("/campgrounds")

}))

  
//   show 
  route.get("/campgrounds/:id", catchAsyc( async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate("reviews")
    if(!campground) {
      req.flash("error", 'Cannot find that campground')
      return  res.redirect("/campgrounds")
    }
    res.render("campgrounds/show.ejs", {campground})
  }))

//   edit 

route.get("/campgrounds/:id/edit", catchAsyc ( async (req, res) => {
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

route.delete("/campgrounds/:id", catchAsyc ( async (req, res) => {
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