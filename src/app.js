const express = require('express');
const app = express();
const path = require('path');
//const passport = require('passport');
//const session = require('express-session');
//const flash = require('connect-flash');
//const initializePassport = require('./auth/passportConfig');
const indexRoutes = require('./routes/index');
//const adminRoutes = require('./routes/admin');

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));

// Passport
//initializePassport(passport);

/*
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});
*/

// Use routes from the "routes" directory
app.use('/', indexRoutes);
//app.use('/admin', adminRoutes);

// Start the server
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
