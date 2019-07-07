// this page call passport to make sure person is authenticated
const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']})); // scope that what we ask user to share when request to authenticate from user

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),(req, res) => {
    res.redirect('/dashboard');
  });

router.get('/verify',(req,res)=>{
  if(req.user)
  {
    console.log(req.user);
  }
  else {
    console.log("NOT Auth");
  }
})

router.get("/logout",(req,res)=>{
  req.logout();
  res.redirect('/');
})

module.exports = router;
