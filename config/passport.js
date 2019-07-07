const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('./keys');
// Load user model
const User = mongoose.model('users');

module.exports = function(passport){
  passport.use(
    new GoogleStrategy({
      clientID: keys.googleClientID,
      clientSecret:keys.googleClientSecret,
      callbackURL:'/auth/google/callback',
      proxy: true
    }, (accessToken, refreshToken, profile, done) => {
      // console.log(accessToken);
      // console.log(profile);

      const image = profile.photos[0].value;
      // indexOf return number , substring cut before number
      const newUser = { // i can access any info in profile by keyword profile then we put of zero because if i have multiple emails or photos i need to access first
        googleID: profile.id,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
        image: image

      }

      // Check for existing user to avoid duplicate
      User.findOne({
        googleID: profile.id
      }).then(user => {
        if(user){
          // Return user
          done(null, user);// null because we don't put error here so we put null , then return user
        } else {
          // Create user then return it
          new User(newUser)
            .save()
            .then(user => done(null, user));
        }
      })
    })
  )
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id).then(user => done(null, user));
  });
}


/*


        Where does user.id go after passport.serializeUser has been called?

The user id (you provide as the second argument of the done function) is saved in the session and is later used to retrieve the whole object via the deserializeUser function.

serializeUser determines which data of the user object should be stored in the session. The result of the serializeUser method is attached to the session as req.session.passport.user = {}. Here for instance, it would be (as we provide the user id as the key) req.session.passport.user = {id: 'xyz'}

        We are calling passport.deserializeUser right after it where does it fit in the workflow?

The first argument of deserializeUser corresponds to the key of the user object that was given to the done function (see 1.). So your whole object is retrieved with help of that key. That key here is the user id (key can be any key of the user object i.e. name,email etc). In deserializeUser that key is matched with the in memory array / database or any data resource.

The fetched object is attached to the request object as req.user

Visual Flow

passport.serializeUser(function(user, done) {
    done(null, user.id);
});              │
                 │
                 │
                 └─────────────────┬──→ saved to session
                                   │    req.session.passport.user = {id: '..'}
                                   │
                                   ↓
passport.deserializeUser(function(id, done) {
                   ┌───────────────┘
                   │
                   ↓
    User.findById(id, function(err, user) {
        done(err, user);
    });            └──────────────→ user object attaches to the request as req.user
});

*/
