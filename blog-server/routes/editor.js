const express = require('express');

const authenticator = require('../service/authenticator.js');
const validator = require('../service/validator.js');

const router = express.Router();

router.all('/', async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (validator.isEmpty(token)) {
      res.redirect(302, '/login?redirect=/editor/');
    } else {
      await authenticator.verifyToken(token);
      next();
    }
  } catch (error) {
    res.redirect(302, '/login?redirect=/editor/');
  }
});

module.exports = router;
