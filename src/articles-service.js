const ArticlesService = {
  getAllArticles: (dbConnection) => {
    return dbConnection.select('*').from('articles');
  },

  insertArticle: (dbConnection, article) => {
    return dbConnection
      .into('articles')
      .insert(article)
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },

  getArticleById: (dbConnection, id) => {
    return dbConnection
      .select('*')
      .from('articles')
      .where('id', '=', id)
      .returning('*')
      .then(rows => rows[0]);
  },

  deleteArticle: (dbConnection, id) => {
    return dbConnection
      .delete()
      .from('articles')
      .where('id', '=', id); // also .where({ id }) works
  },

  updateArticle: (dbConnection, id, data) => {
    return dbConnection
      .into('articles')
      .update(data)
      .where({ id });
  }
};
module.exports = ArticlesService;