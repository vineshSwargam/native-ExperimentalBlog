const LocalStrategy = require('passport-local').Strategy;
const Blogger = require('../models/blogger');
const config = require('../config/database');
const bcrypt = require('bcryptjs');

module.exports = (passport) => {
  passport.use(new LocalStrategy((username, password, done) => {
    let query = {username : username};
    Blogger.findOne(query, (err, blogger) => {
      if(err)throw err;
      if(!blogger){
        return done(null, false, {message : "Blogger doesn't exist"});
      }
      //match password with hashed password in database. First convert this passowrd to hashe
      bcrypt.compare(password, blogger.password, (err, isMatch) => {
        if(err)throw err;
        if(isMatch){
          return done(null, blogger);
        }
        else{
          return done(null, false, {message : 'Wrong Password'})
        }
      });
    });
  }));
//In a typical web application, the credentials used to authenticate
//a user will only be transmitted during the login request. If
//authentication succeeds, a session will be established and maintained
//via a cookie set in the user's browser.

//Each subsequent request will not contain credentials, but rather the
//unique cookie that identifies the session. In order to support login
//sessions, Passport will serialize and deserialize user instances to
//and from the session.

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  Blogger.findById(id, function(err, blogger) {
    done(err, blogger);
  });
});
}
