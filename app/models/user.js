// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    facebookId        : String,
    googleId          : String,
    genjouristId      : String,
    username          : String,
    email             : String,
    name              : String,
    pic               : String,
    dob               : String,
    providers         : String,
    googleProvider    : String,
    facebookProvider  : String,
    googleToken       : String,
    facebookToken     : String,
    createdOn         : String

    // local            : {
    //     email        : String,
    //     password     : String
    // },
    // facebook              : {
    //     id                : String,
    //     username          : String,
    //     token             : String,
    //     email             : String,
    //     name              : String,
    //     pic               : String,
    //     genjouristId     : String
    // },
    // google                : {
    //     id                : String,
    //     token             : String,
    //     email             : String,
    //     name              : String,
    //     pic               : String,
    //     genjouristId     : String
    // }

});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
