// load all the things we need
var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;
var generateID = require("unique-id-generator");


// load up the user model
var User       = require('../app/models/user');

// load the auth variables
var configAuth = require('./auth'); // use this one for testing

module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {
        if (email)
            email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

        // asynchronous
        process.nextTick(function() {
            User.findOne({ 'local.email' :  email }, function(err, user) {
                // if there are any errors, return the error
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.'));

                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

                // all is well, return user
                else
                    return done(null, user);
            });
        });

    }));

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {
        if (email)
            email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

        // asynchronous
        process.nextTick(function() {
            // if the user is not already logged in:
            if (!req.user) {
                User.findOne({ 'local.email' :  email }, function(err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    // check to see if theres already a user with that email
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {

                        // create the user
                        var newUser            = new User();

                        newUser.local.email    = email;
                        newUser.local.password = newUser.generateHash(password);

                        newUser.save(function(err) {
                            if (err)
                                return done(err);

                            return done(null, newUser);
                        });
                    }

                });
            // if the user is logged in but has no local account...
            } else if ( !req.user.local.email ) {
                // ...presumably they're trying to connect a local account
                // BUT let's check if the email used to connect a local account is being used by another user
                User.findOne({ 'local.email' :  email }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {
                        return done(null, false, req.flash('loginMessage', 'That email is already taken.'));
                        // Using 'loginMessage instead of signupMessage because it's used by /connect/local'
                    } else {
                        var user = req.user;
                        user.local.email = email;
                        user.local.password = user.generateHash(password);
                        user.save(function (err) {
                            if (err)
                                return done(err);

                            return done(null,user);
                        });
                    }
                });
            } else {
                // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
                return done(null, req.user);
            }

        });

    }));

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    var fbStrategy = configAuth.facebookAuth;
    fbStrategy.passReqToCallback = true;  // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    passport.use(new FacebookStrategy(fbStrategy,
    function(req, token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {

            // check if the user is already logged in
            if (!req.user) {

                User.findOne({ 'facebookId' : profile.id }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {

                        // if there is a user id already but no token (user was linked at one point and then removed)
                        if (!user.facebookToken) {

                            user.facebookToken = token;
                            //user.username = profile.displayName;
                            user.username  = profile.name.givenName + ' ' + profile.name.familyName;
                            user.email = (profile.emails[0].value || '').toLowerCase();
                            user.pic = "http://graph.facebook.com/" + profile.id + "/picture?type=square";
                            user.dob = "01-01-1996";
                            user.genjouristId = generateID();
                            user.save(function(err) {
                                if (err)
                                    return done(err);

                                return done(null, user);
                            });
                        }

                        return done(null, user); // user found, return that user
                    } else {

                        var Email=(profile.emails[0].value || '').toLowerCase();
                        User.findOne({'email':Email},function(err,user){
                            if(err)
                                return done(err);
                            if(user)
                                {   
                                    console.log(user);
                                    console.log('duplicate email');
                                    user.facebookToken = token;
                                    user.facebookProvider = "yes";
                                    user.save(function(err) {
                                        if (err)
                                            return done(err);
        
                                        return done(null, user);
                                    });
                                }
                            else
                                {
                                     // if there is no user, create them
                                    var newUser            = new User();
                                    newUser.facebookId    = profile.id;
                                    newUser.facebookToken = token;
                                    newUser.username  = profile.name.givenName + ' ' + profile.name.familyName;
                                    newUser.email = (profile.emails[0].value || '').toLowerCase();
                                    newUser.pic = "http://graph.facebook.com/" + profile.id + "/picture?type=square";
                                    newUser.dob = "01-01-1996";
                                    newUser.providers = "Facebook";
                                    newUser.facebookProvider = "yes";
                                    newUser.genjouristId = generateID();
                                    newUser.createdOn = Date();
                                    newUser.save(function(err) {
                                        if (err)
                                            return done(err);

                                        return done(null, newUser);
                                    });
                                }


                        });

                       
                    }
                });

            } else {
                // user already exists and is logged in, we have to link accounts
                var user            = req.user; // pull the user out of the session
                //user.username = profile.displayName;
                user.facebookId    = profile.id;
                user.facebookToken = token;
                user.username  = profile.name.givenName + ' ' + profile.name.familyName;
                user.email = (profile.emails[0].value || '').toLowerCase();
                user.pic = "http://graph.facebook.com/" + profile.id + "/picture?type=square";
                user.dob = "01-01-1996";
                user.genjouristId = generateID();
                user.save(function(err) {
                    if (err)
                        return done(err);

                    return done(null, user);
                });

            }
        });

    }));


    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({

        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

    },
    function(req, token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {

            // check if the user is already logged in
            if (!req.user) {

                User.findOne({ 'googleId' : profile.id }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {

                        // if there is a user id already but no token (user was linked at one point and then removed)
                        if (!user.googleToken) {
                            user.googleToken = token;
                            user.username  = profile.displayName;
                            user.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email
                            //user.google.pic   = 'https://www.googleapis.com/plus/v1/people/'+profile.id+'?fields=image&key=AIzaSyDQBNJ6tXZUrq3NHJhlumwo4cpWwGfr8RE';
                            user.save(function(err) {
                                if (err)
                                    return done(err);

                                return done(null, user);
                            });
                        }

                        return done(null, user);
                    } else {
                        
                        var Email=(profile.emails[0].value || '').toLowerCase();
                        User.findOne({'email':Email},function(err,user){
                            if(err)
                                return done(err);
                            if(user)
                                {   
                                    console.log(user);
                                    console.log('duplicate email');
                                    user.googleToken = token;
                                    user.save(function(err) {
                                        if (err)
                                            return done(err);
        
                                        return done(null, user);
                                    });
                                }
                            else
                                {
                                    var newUser          = new User();
                                    newUser.googleId    = profile.id;
                                    newUser.googleToken = token;
                                    newUser.useername  = profile.displayName;
                                    newUser.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email
                                    newUser.providers = "Google";
                                    newUser.googleProvider = "yes";
                                    newUser.dob = "01-01-1996";
                                    newUser.createdOn = Date();
                                    
                                    
                                    //newUser.google.pic   = 'https://www.googleapis.com/plus/v1/people/'+profile.id+'?fields=image&key=AIzaSyDQBNJ6tXZUrq3NHJhlumwo4cpWwGfr8RE';
                                    
                                    newUser.save(function(err) {
                                        if (err)
                                            return done(err);
            
                                        return done(null, newUser);
                                    });
                                }


                        });
                        
                    }
                });

            } else {
                // user already exists and is logged in, we have to link accounts
                var user               = req.user; // pull the user out of the session

                user.googleId    = profile.id;
                user.googleToken = token;
                user.username  = profile.displayName;
                user.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email
                //user.google.pic   = 'https://www.googleapis.com/plus/v1/people/'+profile.id+'?fields=image&key=AIzaSyDQBNJ6tXZUrq3NHJhlumwo4cpWwGfr8RE';
                
                user.save(function(err) {
                    if (err)
                        return done(err);

                    return done(null, user);
                });

            }

        });

    }));

};
