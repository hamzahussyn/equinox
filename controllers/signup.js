const express = require('express');
const router = express.Router();
const db = require('../models');
const verifyTokenHelper = require('../helpers/verifyTokenSync');

router.route('/signup')
  .get(async function (req, res) {
    if(await verifyTokenHelper(req.cookies.authToken)){
      return res.redirect('/equivalence');
    }

    res.render('signup');
  })
  .post(async function (req, res) {
    const {body} = req;
    console.log(body);
    
    const userWithUsername = await db.User.findOne({where: {username: body.username.toLowerCase()}});
    const userWithEmail = await db.User.findOne({where: {email: body.email.toLowerCase()}});

    if(userWithUsername){
      return res.render('signup', {userNameError: "User Name Already exist", ...body});
    }

    if(userWithEmail){
      return res.render('signup', {emailError: "User with this email already exist.", ...body});
    }

    const createUser = await db.User.create({
      email: body.email.toLowerCase(),
      name: body.name.toLowerCase(),
      username: body.username.toLowerCase(),
      profession: body?.role ?? "",
      password: body.password
    })

    res.redirect('login');
  })

module.exports = router;