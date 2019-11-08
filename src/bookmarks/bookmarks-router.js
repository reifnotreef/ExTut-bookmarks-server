const express = require('express');
const { isWebUri } = require('valid-url');
const logger = require('../logger');
const BookmarkServices = require('../bookmark-services');
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
        return res.status(400).send(`'${field}' is required`);
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
  .get((req, res) => {
    const { bookmark_id } = req.params;

    // const bookmark = store.bookmarks.find(c => c.id == bookmark_id);
    BookmarkServices.getById(db, bookmark_id).then(
      bookmark => {
        res
          .status(201)
          .location(`http://localhost:8000/bookmarks/${bookmark_id}`)
          .json(serializeBookmark(bookmark));
      }
      // console.log(result)
    );
    // .catch(next);
    // if (!bookmark) {
    //   logger.error(`Bookmark with id ${bookmark_id} not found.`);
    //   return res.status(404).send('Bookmark Not Found');
    // }

    // res.json(bookmark);
  })
  .delete((req, res, next) => {
    const { bookmark_id } = req.params;

    // const bookmarkIndex = store.bookmarks.findIndex(b => b.id === bookmark_id);
    const bookmarkIndex = BookmarkServices.deleteById(db, bookmark_id)
      .then(
        bookmark => {
          res.status(204).end();
        }
        // console.log(result)
      )
      .catch(next);
    if (bookmarkIndex === -1) {
      logger.error(`Bookmark with id ${bookmark_id} not found.`);
      return res.status(404).send('Bookmark Not Found');
    }

    // store.bookmarks.splice(bookmarkIndex, 1);

    logger.info(`Bookmark with id ${bookmark_id} deleted.`);
    res.status(204).end();
  });

module.exports = bookmarksRouter;
