require('dotenv').config();
const knex = require('knex');
const ArticlesService = require('./articles-service');

const db = knex({
  connection: process.env.DB_URL,
  client: 'pg'
});

console.log(ArticlesService.getAllArticles());
