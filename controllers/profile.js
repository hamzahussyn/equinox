const express = require('express');
const router = express.Router();
const db = require('../models');

router.post('/update-profile/:username', async (req, res) => {
  console.log(req.params.username);
  console.log(req.body);
  const {classes} = req.body;
  const User = await db.User.findOne({where: {username: req.params.username}});

  let meta = {};

  if(User.meta !== null){
    meta = JSON.parse(User.meta);
  }

  for(let i=0 ; i<classes.length ; i++){
    if( i==0 ){
      meta[classes[i]] = meta[classes[i]] ? parseFloat(meta[classes[i]]) + 1 : 1;
    } else {
      meta[classes[i]] = meta[classes[i]] ? parseFloat(meta[classes[i]]) + 0.5 : 0.5;
    }
  }

  await db.User.update({meta: JSON.stringify(meta)}, {where: {username: req.params.username}})
  res.redirect(`/profile/${req.params.username}`);
})

router
  .route('/profile/:username')
  .get(async function(req, res) {
    console.log(req.params.username);

    const User = await db.User.findOne({where: {username: req.params.username}});

    res.render('profile', {name: User.name, profession: User.profession, email: User.email, tokens: JSON.parse(User.meta ?? "{}"), count: Object.keys(JSON.parse(User.meta ?? "{}")).length ?? 0});
  })

module.exports = router