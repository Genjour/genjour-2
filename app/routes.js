var fileUpload = require('express-fileupload');
var Article    = require('../app/models/article');
var Quotation  = require('../app/models/quotation');
var uniqid     = require('uniqid');
var User       = require('../app/models/user');
var cors       = require('cors');
// var Ayush      = require('../app/models/ayush');
module.exports = function(app, passport) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        res.cookie('genjourist', req.user.genjouristId);
        res.render('profile.ejs', {
            user : req.user
        });
        
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // facebook -------------------------------


     
        // send to facebook to do the authentication
        app.get('/auth/facebook',  passport.authenticate('facebook', { scope : ['email','user_birthday'] }) );

        // handle the callback after facebook has authenticated the user
        app.get('/auth/facebook/callback',
            passport.authenticate('facebook', {
             successRedirect : '/profile',
             failureRedirect : '/'
        
         }        
        ));


    // google ---------------------------------

        // send to google to do the authentication
        app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

        // the callback after google has authenticated the user
        app.get('/auth/google/callback',
            passport.authenticate('google', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));


// =============================================================================
//====================== POSTING A ARTICLE INTO DB =============================
// =============================================================================

    app.post('/article', function(req, res) {
        if (!req.files)
              return res.status(400).send('No files were uploaded.');

              // input file upload tagname from frontend
              let file = req.files.articleImage;
              fileName = file.name;
              // moving file to server
              file.mv("assets/articles/img/"+fileName, function(err) {
              if (err)
                return res.status (500).send(err);

               // console.log(req.body.category+' '+ req.body.articleContent+' '+req.body.articleHash+' '+req.body.articleTitle);

                  var article = new Article();
                  article.content = req.body.articleContent;
                  article.title = req.body.articleTitle;
                  article.category = req.body.category;
                  article.tags = req.body.articleHash;
                  article.image = fileName;
                  
                  article.genjouristId = req.cookies.genjourist;

                  article.date = Date();
                  article.articleId = uniqid();
                  article.save(function(err, docs){
                  if(err) throw err;
                  console.log("Article saved in database");
                  res.json(docs);
                });
        });
    });

// =============================================================================
//====================== POSTING A QUOTATION INTO DB ===========================
// =============================================================================


app.post('/quotation', function(req, res) {
 
            console.log(req.body.quotationCategory+' '+ req.body.quotationContent);

              var quotation = new Quotation();
              quotation.category = req.body.quotationCategory;
              quotation.content = req.body.quotationContent;
              quotation.id = uniqid();
              quotation.genjouristId = req.cookies.genjourist;
              quotation.save(function(err, docs){
              if(err) throw err;
              console.log("Quotation saved in database");
              res.json(docs);
            });

    });


// =============================================================================
//====================== Profile by genjourist ID ==============================
// =============================================================================

    app.get('/genjourist/:id', function(req, res) {
        console.log(req.params.id);
        User.findOne({ 'genjouristId' : req.params.id }, function(err, genjourist) {
            //console.log(genjourist);
            res.render('genjourist.ejs',
                {
                    genjourist:genjourist
                });
            //res.json(docs.facebookProvider);
        });
    });


};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
