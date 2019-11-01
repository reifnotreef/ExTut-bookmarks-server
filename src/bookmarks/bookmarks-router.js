// node reqs
const express = require('express');
const uuid = require('uuid/v4');
const routeValidator = require('express-route-validator');

// local reqs
const logger = require('../logger');
const store = require('../store');

// express reqs
const bookmarksRouter = express.Router();
const bodyParser = express.json();

bookmarksRouter
  .route('/bookmarks')
  .get((req, res) => {
    res.json(store.bookmarks);
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
    (req, res) => {
      const bookmark = {
        id: uuid(),
        title: req.body.title,
        url: req.body.url,
        description: req.body.description,
        rating: req.body.rating,
      };

      store.bookmarks.push(bookmark);
      logger.info(`Bookmark ${bookmark.id} created`);
      res
        .status(201)
        .location(`http://localhost:8000/bookmarks/${bookmark.id}`)
        .json(bookmark);
    }
  );

bookmarksRouter
  .route('/bookmarks/:bookmark_id')
  .get((req, res) => {
    const { bookmark_id } = req.params;

    const bookmark = store.bookmarks.find(item => item.id == bookmark_id);

    if (!bookmark) {
      logger.error(`Bookmark ${bookmark_id} not found.`);
      return res.status(404).send(`Bookmark ${bookmark_id} Not Found`);
    }

    res.json(bookmark);
  })
  .delete((req, res) => {
    const { bookmark_id } = req.params;

    const bookmarkIndex = store.bookmarks.findIndex(
      item => item.id === bookmark_id
    );

    if (bookmarkIndex === -1) {
      logger.error(`Bookmark ${bookmark_id} not found.`);
      return res.status(404).send(`Bookmark ${bookmark_id} Not Found`);
    }

    store.bookmarks.splice(bookmarkIndex, 1);

    logger.info(`Bookmark ${bookmark_id} deleted.`);
    res.status(204).end();
  });

module.exports = bookmarksRouter;
