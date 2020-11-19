
const passportLocalMongoose = require("passport-local-mongoose")
const mongoose = require("mongoose")
const Schema = mongoose.Schema



const userSchema = new Schema({
    email: {
        required: true,
        type: String,
        unique: true
    }

})



userSchema.plugin(passportLocalMongoose)


module.exports = mongoose.model('User', userSchema)