var express  = require('express');
var app      = express();
var cors       = require('cors');
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var generateID = require("unique-id-generator");
var fileUpload = require('express-fileupload');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database
app.use(cors({
    origin:'http://localhost:4200',
    crendentials:true
}));
require('./config/passport')(passport); // pass passport for configuration
// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs'); // set up ejs for templating
// required for passport
app.use(session({
    secret: 'secretkey', // session secret
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
//==============================================================================
app.use(fileUpload());
// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport



// launch ======================================================================
app.listen(port);
console.log('server running at port ' + port);
