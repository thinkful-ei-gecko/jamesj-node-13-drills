require('dotenv').config();
const knex = require('knex');
const ArticlesService = require('./articles-service');

const db = knex({
  connection: process.env.DB_URL,
  client: 'pg'
});

ArticlesService.getAllArticles(db)
  .then(articles => console.log('get all', articles))
  .then(() => 
    ArticlesService.insertArticle(db, {
      title: 'Finished Product',
      content: 'Proof of concept this stuff all works',
      date_published: new Date()
    })
  )
  .then(newArticle => {
    console.log('new article',newArticle);
    return ArticlesService
      .updateArticle(db, newArticle.id, {title: 'updated proof'})
      .then(() => ArticlesService.getArticleById(db, newArticle.id));
  })
  .then(article => {
    console.log('new and updated',article);
    return ArticlesService.deleteArticle(db, article.id);
  });
