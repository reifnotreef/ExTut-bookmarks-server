const express = require('express');
const { isWebUri } = require('valid-url');
const logger = require('../logger');
const BookmarkServices = require('./bookmark-services');
const knex = require('knex');
const xss = require('xss');

const bookmarksRouter = express.Router();
const bodyParser = express.json();

const db = knex({
  client: 'pg',
  connection: process.env.DB_URL,
});

const serializeBookmark = bookmark => ({
  id: bookmark.id,
  title: xss(bookmark.title),
  url: bookmark.url,
  description: xss(bookmark.description),
  rating: Number(bookmark.rating),
});

bookmarksRouter
  .route('/bookmarks')
  .get((req, res, next) => {
    BookmarkServices.getAll(db)
      .then(results => {
        res.json(results.map(serializeBookmark));
      })
      .catch(next);
  })
  .post(bodyParser, (req, res) => {
    for (const field of ['title', 'url', 'rating']) {
      if (!req.body[field]) {
        logger.error(`${field} is required`);
        return res
          .status(400)
          .send({ error: { message: `'${field}' is required` } });
      }
    }
    const { title, url, description, rating } = req.body;

    if (!Number.isInteger(rating) || rating < 0 || rating > 5) {
      logger.error(`Invalid rating '${rating}' supplied`);
      return res.status(400).send(`'rating' must be a number between 0 and 5`);
    }

    if (!isWebUri(url)) {
      logger.error(`Invalid url '${url}' supplied`);
      return res.status(400).send(`'url' must be a valid URL`);
    }

    const bookmark = (title, url, rating, description);
    BookmarkServices.insertItem(db, bookmark)
      .then(bookmark => {
        res
          .status(201)
          .location('/bookmarks/${bookmark.id}')
          .json(serializeBookmark(bookmark));
      })
      .catch(next);

    logger.info(`Bookmark with id ${bookmark.id} created`);
    res
      .status(201)
      .location(`http://localhost:8000/bookmarks/${bookmark.id}`)
      .json(bookmark);
  });

bookmarksRouter
  .route('/bookmarks/:bookmark_id')
  .all((req, res, next) => {
    const { bookmark_id } = req.params;
    BookmarkServices.getById(db, bookmark_id)
      .then(bookmark => {
        if (!bookmark) {
          logger.error(`Bookmark with id ${bookmark_id} not found.`);
          return res.status(404).json({
            error: { message: `Bookmark Not Found` },
          });
        }
        res.bookmark = bookmark;
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(serializeBookmark(res.bookmark));
  })
  .delete((req, res, next) => {
    const { bookmark_id } = req.params;
    BookmarkServices.deleteById(db, bookmark_id)
      .then(() => {
        logger.info(`Bookmark with id ${bookmark_id} deleted.`);
        res
          .location('/bookmarks/${bookmark.id}')
          .status(204)
          .end();
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    const { bookmark_id } = req.params;
    BookmarkServices.updateItem(db, bookmark_id, req.body)
      .then(() => {
        logger.info(`Bookmark with id ${bookmark_id} edited.`);
        res.status(201).end();
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(serializeBookmark(res.bookmark));
  });

module.exports = bookmarksRouter;
