// create ListService
const ListService = {
  // method getList()
  getList: (db) => {
    return db
      .select('*')
      .from('shopping_list');
  },
  // method addListItem
  addListItem: (db, data) => {
    return db('shopping_list')
      .insert(data)
      .returning('*')
      .then(res => res[0]);
  },
  // method updateListItem()
  updateListItem: (db, id, data) => {
    return db('shopping_list')
      .update(data)
      .where({ id });
  },
  // method deleteListItem()
  deleteListItem: (db, id) => {
    return db('shopping_list')
      .delete()
      .where({ id });
  }

};

module.exports = ListService;