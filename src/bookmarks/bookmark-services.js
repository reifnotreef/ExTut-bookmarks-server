const BookmarkServices = {
  getAll(knex) {
    return knex.select('*').from('bookmarks');
  },
  getById(knex, id) {
    return knex
      .select('*')
      .where({ id })
      .from('bookmarks')
      .first();
  },
  updateItem(knex, targetId, data) {
    return knex('bookmarks')
      .where({ id: targetId })
      .update(data);
  },
  insertItem(knex, item) {
    return knex
      .insert(item)
      .into('bookmarks')
      .returning('*')
      .then(rows => rows[0]);
  },
  deleteById(knex, id) {
    return knex('bookmarks')
      .where({ id })
      .del();
  },
};

module.exports = BookmarkServices;
