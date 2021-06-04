const express = require('express');

const authenticator = require('../service/authenticator.js');
const validator = require('../service/validator.js');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('auth', {
    redirect: req.query.redirect,
    username: req.query.username,
    password: req.query.password,
    error: null,
  });
});

router.post('/', async (req, res) => {
  try {
    validator.validateUsername(req.body.username);
    validator.validatePassword(req.body.password);
    const token = await authenticator.authenticateUser(req.body.username, req.body.password);
    res.cookie('jwt', token);
    if (!validator.isEmpty(req.body.redirect)) {
      res.redirect(req.body.redirect);
    } else {
      res.render('auth', {
        redirect: undefined,
        username: null,
        password: null,
        error: null,
      });
    }
  } catch (error) {
    res.status(401);
    res.render('auth', {
      redirect: req.params.redirect,
      username: null,
      password: null,
      error,
    });
  }
});

module.exports = router;
