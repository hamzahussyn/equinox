const express = require("express");
const { checkSchema } = require("express-validator");
const { RegisterRequestSchema, LoginRequestSchema } = require("../dtos/auth");
const VerifyToken = require("../middlewares/verifyToken");
const { register, login, refresh, me } = require("../services/auth");

const router = express.Router();


router.post("/register", checkSchema(RegisterRequestSchema), register);

router.post("/login", checkSchema(LoginRequestSchema), login);

router.post("/refresh", refresh);

router.get("/me", VerifyToken, me);

module.exports = router;
