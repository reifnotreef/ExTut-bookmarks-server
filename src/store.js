const uuid = require('uuid/v4');

const bookmarks = [
  {
    id: uuid(),
    title: 'SO',
    url: 'https://stackoverflow.com/',
    description: "It's like quora meets reddit, for developers",
    rating: 4,
  },
  {
    id: uuid(),
    title: 'MDN',
    url: 'https://developer.mozilla.org',
    description: 'The only place to find web documentation',
    rating: 5,
  },
];

module.exports = { bookmarks };
