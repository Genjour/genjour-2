// load the things we need
var mongoose = require('mongoose');


var quotationSchema = mongoose.Schema({

        id            : String,
        genjouristId  : String,
        genjourist    : String,
        category      : String,
        title         : String,
        content       : String,
        date          : {
            type:Date,
            default: Date.now
        }


});

module.exports = mongoose.model('Quotation', quotationSchema);
