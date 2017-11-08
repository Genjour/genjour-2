// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var articleSchema = mongoose.Schema({


    article           : {
        id            : String,
        genjouristId  : String,
        genjourist    : String,
        category      : String,
        title         : String,
        date          : String,
        time          : String,
        tags          : String
    }

});


// create the model for users and expose it to our app
module.exports = mongoose.model('Article', articleSchema);
