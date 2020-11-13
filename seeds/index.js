
const {descriptors, places}  = require("./seedHelper")
const Campground = require("../models/campground")
const mongoose = require('mongoose')
const cities = require("./cities")





mongoose.connect('mongodb://localhost:27017/camp_website', {useNewUrlParser: true, useUnifiedTopology: true}, (err, result) => {
  if(err) {
    console.log(err)
  } else {
    console.log(" seed DATABASE connected")
  }
});

const sample = (array) =>  array[Math.floor(Math.random() * array.length)]
const seedDB = async () => {
    await Campground.deleteMany({})

    for(let i = 0; i < 50 ; i++ ){

        const price = Math.floor(Math.random() * 20 ) + 10
        const random1000 = Math.floor(Math.random() * 1000)
        const camp =   new Campground({
            location: `${cities[random1000].city},  ${cities[random1000].state}`,
            price: price,
            title: `${sample(descriptors)} ${sample(places) }`,
            image: "https://source.unsplash.com/collection/483251",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur congue urna odio, ac ullamcorper risus auctor non. Donec at augue mattis, mattis ligula in, fermentum risus. Quisque consequat elit non diam tristique dignissim."        
    })
       await camp.save();
    }

  
   
}








seedDB()
    .then(() => {
    mongoose.connection.close()
    })
    .catch((err) => {
        console.log(err)
    })
