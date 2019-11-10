// node reqs
const express = require('express');
const uuid = require('uuid/v4');
const routeValidator = require('express-route-validator');

// local reqs
const logger = require('../logger');
const { bookmarkValidation } = require('./bookmark-validation');
const BookmarksService = require('./bookmark-services');

// express reqs
const bookmarksRouter = express.Router();
const bodyParser = express.json();

const serializeBookmark = bookmark => ({
  id: bookmark.id,
  title: xss(bookmark.title),
  url: bookmark.url,
  description: xss(bookmark.description),
  rating: Number(bookmark.rating),
});

bookmarksRouter
  .route('/')

  .get((req, res, next) => {
    BookmarksService.getAllBookmarks(req.app.get('db'))
      .then(bookmarks => {
        res.json(bookmarks.map(serializeBookmark));
      })
      .catch(next);
  })

  .post(
    bodyParser,
    routeValidator.validate({
      body: {
        title: { isRequired: true },
        url: { isRequired: true, isUrl: true },
        description: { isRequired: true },
        rating: {
          isRequired: true,
          isInt: { min: 1, max: 5 },
          message: 'Rating must be an integer between 1 and 5.',
        },
      },
    }),
    (req, res, next) => {
      const { title, url, description, rating } = req.body;
      const newBookmark = { title, url, description, rating };

      for (const field of ['title', 'url', 'rating']) {
        if (!newBookmark[field]) {
          logger.error(`${field} is required`);
          return res.status(400).send({
            error: { message: `'${field}' is required` },
          });
        }
      }

      const error = bookmarkValidation(newBookmark);

      if (error) return res.status(400).send(error);

      BookmarksService.insertBookmark(req.app.get('db'), newBookmark)
        .then(bookmark => {
          logger.info(`Bookmark with id ${bookmark.id} created.`);
          res
            .status(201)
            .location(path.posix.join(req.originalUrl, `${bookmark.id}`))
            .json(serializeBookmark(bookmark));
        })
        .catch(next);
    }
  );

bookmarksRouter
  .route('/:bookmark_id')
  .get((req, res, next) => {
    const { bookmark_id } = req.params;
    BookmarksService.getById(db, bookmark_id)
      .then(bookmark => {
        !bookmark
          ? logger.error(`Bookmark with id ${bookmark_id} not found`)
          : (res.bookmark = bookmark);
        next();
      })
      .catch(next);
  })
  .delete((req, res) => {
    const { bookmark_id } = req.params;
    BookmarksService.delete(db, bookmark_id)
      .then(bookmark => {
        !bookmark
          ? logger.error(`Bookmark with id ${bookmark_id} not found`)
          : res.status(204).end();
      })
      .catch(next);
  })
  .post(bodyParser, (req, res) => {
    const { bookmark_id } = req.params;
    const { title, url, description, rating } = req.body;
    const updateTarget = { title, url, description, rating };

    BookmarksService.update(db, bookmark_id, updateTarget)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = bookmarksRouter;
