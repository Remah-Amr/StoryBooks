const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const path = require('path');
const methodOverride = require('method-override');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

// Load models
require("./models/User")
require("./models/Story")

// passport config
require('./config/passport')(passport); // pass module passport 'above' to file passport

// Load routes
const index = require('./routes/index');
const auth = require('./routes/auth');
const stories = require('./routes/stories');

const app = express();


// Load Keys
const keys = require('./config/keys');

// handlebars helpers
const {truncate,stripTags,formatDate,select,editIcon} = require('./helpers/hbs');

// Map global promises
mongoose.Promise = global.Promise;
// Mongoose Connect
mongoose.connect(keys.mongoURI,{ useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


// Handlebars Middleware
  app.engine('handlebars', exphbs({
    helpers:{
      truncate:truncate,
      stripTags:stripTags,
      formatDate:formatDate,
      select:select,
      editIcon:editIcon
    },
    defaultLayout:'main'
  }));
  app.set('view engine', 'handlebars');
// we must put these lines above of passport middleware
app.use(cookieParser());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session()); // to run this line we need middleware above of (app.use(session ......))

// bodyParser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// methodOverride middleware
app.use(methodOverride('_method'));


// Set global vars
app.use((req, res, next) => {
  res.locals.user = req.user || null; // This will make a user variable available in all templates, provided that req.user is populated.
  // if i logged in session , then will be req.user , if i didn't that is null
  next();
});

// static folder
app.use(express.static(path.join(__dirname,'public')));

// advise : make route below always last thing in the page

// use routes
app.use('/',index);
app.use('/auth',auth);
app.use('/stories',stories);



const port = process.env.PORT ||9999; // to open live , in heroku it 4000

app.listen(port,()=>{
  console.log(`server started on port ${port}`);
})

// middleware functions we use it to  when request from user begin to excute my code , y3ny 7aga btsa3dny 34an akml l code lma ytb3tly req
