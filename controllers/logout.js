const express = require('express');
const router = express.Router();
const path = require('path');

router.route('/logout').get(function (req, res) {
  res.clearCookie('authToken');
  res.clearCookie('name');
  res.clearCookie('userName');

  res.sendFile(path.join(__dirname, '../') + '/views/index.html');
})

module.exports = router;