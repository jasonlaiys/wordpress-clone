const express = require('express');
const commonmark = require('commonmark');

const blogs = require('../model/blogs.js');
const validator = require('../service/validator.js');

const router = express.Router();

const parser = new commonmark.Parser();
const renderer = new commonmark.HtmlRenderer();

const renderOne = (post) => ({
  title: renderer.render(parser.parse(post.title)),
  body: renderer.render(parser.parse(post.body)),
  created: new Date(post.created).toString(),
  modified: new Date(post.modified).toString(),
});

const renderMany = (posts) => posts.map((post) => renderOne(post));

router.get('/:username', async (req, res) => {
  try {
    validator.validateUsername(req.params.username);
    const startId = req.query.start ? parseInt(req.query.start, 10) : 1;
    const rawPosts = await blogs.getFivePostsFromIndex(req.params.username, startId);
    const posts = rawPosts.length > 5 ? renderMany(rawPosts.slice(0, 5)) : renderMany(rawPosts);
    const nextUrl = rawPosts.length > 5 ? `/blog/${req.params.username}?start=${rawPosts[5].postid}` : '';
    res.render('blogs', { posts, nextUrl });
  } catch (error) {
    res.status(error.httpStatus);
    res.render('error', { error });
  }
});

router.get('/:username/:postid', async (req, res) => {
  try {
    validator.validatePostId(req.params.postid);
    const rawPost = await blogs.getOnePost(req.params.username, parseInt(req.params.postid, 10));
    const post = renderOne(rawPost);
    res.render('blog', { post });
  } catch (error) {
    res.status(error.httpStatus);
    res.render('error', { error });
  }
});

module.exports = router;
