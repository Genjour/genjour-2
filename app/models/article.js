// load the things we need
var mongoose = require('mongoose');


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

module.exports = a;
