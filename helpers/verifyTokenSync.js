const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const { ErrorHandler } = require("../helpers/errorHandler");
require("dotenv").config();

async function verifyTokenHelper(token){
  if(!token){
    return false;
  }

  let error = false;
  let result = await jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if(err){
      error = true
    }
  })

  return error ? false : true;
}

module.exports = verifyTokenHelper