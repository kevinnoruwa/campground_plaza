
const ExpressError = require("../utils/expressError")
const Joi = require('joi')


module.exports.validateCampground = (req, res, next) => {
    const campgroundSchema = Joi.object({
        campground: Joi.object({
          price: Joi.number().required().min(0),
          description: Joi.string().required(),
          location: Joi.string().required(),
          title: Joi.string().required(),
          image: Joi.string().required(),
        }).required()
      })
    
      const {error} = campgroundSchema.validate(req.body)
    
      if(error) {
        const msg = error.details.map((e) => e.message).join(',')
        throw new ExpressError(msg, 400)
      } else {
          next()
      }

}




module.exports.validateReview = (req, res, next) => {
  const reviewSchema = Joi.object({
    review: Joi.object({

      rating: Joi.number().required().min(1).max(5),
      body: Joi.string().required()

    }).required()
  })
  const {error} = reviewSchema.validate(req.body)

  if(error) {
    const msg = error.details.map((e) => e.message).join(',')
    throw new ExpressError(msg, 400)

  } else {
    next()
  }
  
}


