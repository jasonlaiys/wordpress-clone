const express = require('express');

const authenticator = require('../../service/authenticator.js');
const validator = require('../../service/validator.js');
const query = require('../../service/query.js');
const blogs = require('../../model/blogs.js');

const router = express.Router();

router.route('/')
  .all(async (req, res, next) => {
    try {
      const username = req.query.username || req.body.username;
      validator.validateUsername(username);
      const token = req.cookies.jwt;
      await authenticator.verifyTokenAndUsername(token, username);
      next();
    } catch (error) {
      res.status(error.httpStatus).json({ status: error.httpStatus, message: error.message });
    }
  })
  .get(async (req, res) => {
    try {
      validator.validateUsername(req.query.username);
      if (req.query.postid) {
        validator.validatePostId(req.query.postid);
        const post = await blogs.getOnePost(req.query.username, parseInt(req.query.postid, 10));
        res.json(post);
      } else {
        const posts = await blogs.getAllPosts(req.query.username);
        res.json(posts);
      }
    } catch (error) {
      res.status(error.httpStatus).json({ status: error.httpStatus, message: error.message });
    }
  })
  .post(async (req, res) => {
    try {
      validator.validateUsername(req.body.username);
      validator.validatePostId(req.body.postid);
      const postid = parseInt(req.body.postid, 10);
      if (postid === 0) {
        validator.validateTitle(req.body.title, req.body.body);
        const post = await query.insertNewPost(req.body.username, req.body.title, req.body.body);
        res.status(201).json(post);
      } else {
        await blogs.updateOnePost(req.body.username, postid, req.body.title, req.body.body);
        const post = await blogs.getOnePost(req.body.username, postid);
        res.json(post);
      }
    } catch (error) {
      res.status(error.httpStatus).json({ status: error.httpStatus, message: error.message });
    }
  })
  .delete(async (req, res) => {
    try {
      validator.validateUsername(req.query.username);
      validator.validatePostId(req.query.postid);
      await blogs.deleteOnePost(req.query.username, parseInt(req.query.postid, 10));
      res.status(204).json({});
    } catch (error) {
      res.status(error.httpStatus).json({ status: error.httpStatus, message: error.message });
    }
  });

module.exports = router;
