var express = require("express");
const { StatusCodes } = require("http-status-codes");
var router = express.Router();

router.get("/", function (req, res, next) {
  res.status(StatusCodes.OK).json({message: 'equinox-web-app'})
});

module.exports = router;
