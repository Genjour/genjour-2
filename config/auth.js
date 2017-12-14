// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'        : '585527498502433', // your App ID
        'clientSecret'    : '7ba3b1e34c41c2da675f3eecc2bc7aaa', // your App Secret
        'callbackURL'     : 'http://localhost:8080/auth/facebook/callback',
        'profileURL' :       'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email'

    },

    'twitterAuth' : {
        'consumerKey'        : 'your-consumer-key-here',
        'consumerSecret'     : 'your-client-secret-here',
        'callbackURL'        : 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'         : '249599959777-g84j52g3l8vm0bvn2j5f9b37ci62j9iq.apps.googleusercontent.com',
        'clientSecret'     : '0HnZSVf3Bazw1KQ7vnpG8IYy',
        'callbackURL'      : 'http://localhost:8080/auth/google/callback'
    }

};
