const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//Bring in Users Models
let User = require('../models/user');

// Register Form
router.get('/register', function(req, res) {
  res.render('register');
});

// Register Process
router.post('/register', function(req, res) {
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('confirmPassword', 'Passwords do not match').equals(req.body.password);

  let errors = req.validationErrors();

  if (errors) {
    res.render('register', {
      errors: errors
    });
  } else {
    let newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password
    });

    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(newUser.password, salt, function(err, hash) {
        if (err) {
          console.log(err);
        }
        newUser.password = hash;
        newUser.save(function(err) {
          if (err) {
            console.log(err);
            return;
          } else {
            req.flash('success', 'User Successfully Registered and Can Log In');
            res.redirect('/users/login');
          }
        });
      });
    });
  }
});

// Login Form
router.get('/login', function(req, res) {
  res.render('login');
});

// Login Process
router.post('/login', function(req, res, next) {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
  req.flash('success', 'User Logged In');
});

// Profile Form
router.get('/profile', function(req, res) {
  res.render('profile');
});

// Profile Process
router.post('/profile', function(req, res) {
});

// Logout
router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', 'User Logged Out');
  res.redirect('/users/login');
});

module.exports = router;
