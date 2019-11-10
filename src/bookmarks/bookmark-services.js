const BookmarksService = {
  getAll(knex) {
    return knex.select('*').from('bookmarks');
  },
  getById(knex, id) {
    return knex
      .from('bookmarks')
      .select('*')
      .where('id', id)
      .first();
  },
  insert(knex, newBookmark) {
    return knex
      .insert(newBookmark)
      .into('bookmarks')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },
  delete(knex, id) {
    return knex('bookmarks')
      .where({ id })
      .delete();
  },
  update(knex, id, data) {
    return knex('bookmarks')
      .where({ id })
      .update(data);
  },
};

module.exports = BookmarksService;
