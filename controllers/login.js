const express = require('express');
const { checkHash } = require('../helpers/security');
const { createToken } = require('../helpers/token');
const verifyTokenHelper = require('../helpers/verifyTokenSync');
const router = express.Router();
const db = require('../models');

router.route('/login')
  .get(async function (req, res) {
    
    if(await verifyTokenHelper(req.cookies.authToken)){
      return res.redirect('/equivalence');
    }
    
    res.render('login');
  })
  .post(async function (req, res) {
    console.log(req.body);
    const User = await db.User.findOne({where: {email: req.body.email}});

    if(!User){
      return res.render('login', {loginError: "Email doesn't exist.", email: req.body.email})
    }

    if(!checkHash(req.body.password, User.salt, User.password)){
      return res.render('login', {loginError: "Invalid Credentials.", email: req.body.email})
    }

    const token = createToken(User.id);
    const newToken = await db.JwtToken.create({
      token,
      user_id: User.id,
    });

    res.cookie('authToken', token);
    res.cookie('userName', User.username);
    res.cookie('email', User.email);
    res.cookie('name', User.name);

    return res.render('get-equivalence');
  })

module.exports = router;