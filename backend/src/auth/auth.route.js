const express = require('express');
// router used for handling http request to particular function handler
const router = express.Router();
const authController = require('./auth.controller');
router.post('/signUp', authController.signUp);
module.exports = router;
