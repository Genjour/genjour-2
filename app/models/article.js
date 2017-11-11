// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var articleSchema = mongoose.Schema({

        id            : String,
        articleId     : String,
        genjouristId  : String,
        genjourist    : String,
        category      : String,
        title         : String,
        content       : String,
        date          : {
            type:Date,
            default: Date.now
        },
        tags          : String,
        image         : String


});


var a = mongoose.model('articles', articleSchema);
// create the model for users and expose it to our app
module.exports = a;
