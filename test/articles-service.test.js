require('dotenv').config();
const knex = require('knex');
const ArticlesService = require('../src/articles-service');

describe('ArticlesService object', () => {
  let db;
  let testArticles = [
    {id: 1, date_published: new Date('2029-01-22T16:28:32.615Z'), title: 'First test title', content: 'Lorem ipsum'},
    {id: 2, date_published: new Date('2100-05-22T16:28:32.615Z'), title: 'Second test title', content: 'Lorem ipsum'},
    {id: 3, date_published: new Date('1919-12-22T16:28:32.615Z'), title: 'Third test title', content: 'Lorem ipsum'}
  ];

  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });
  });

  before(() => {
    return db
      .truncate('articles');
  });

  afterEach(() => db('articles').truncate());

  after(() => db.destroy());

  context('Given \'articles\' has data', () => {

    beforeEach(() => {
      return db
        .into('articles')
        .insert(testArticles);
    });

    it('resolves all articles from \'articles\' table', () => {
      // test ArticlesService.getAllArticles() here
      return ArticlesService.getAllArticles(db)
        .then(actual => expect(actual).to.eql(testArticles));
    });

    it('getArticleById() fetchs an article and resolves with object', () => {
      return ArticlesService.getArticleById(db, 1)
        .then(actual => expect(actual).to.eql(testArticles[0]));
    });

    it('deleteArticle() removes article by id', () => {
      const id = 3;
      return ArticlesService.deleteArticle(db, id)
        .then(() => ArticlesService.getAllArticles(db))
        .then(allArticles => {
          const expected = testArticles.filter(article => article.id !== id);
          expect(allArticles).to.eql(expected);
        });
    });

    it('updateArticle() updates article by id', () => {
      const id = 2;
      const data = {title: 'update title', content: 'update content', date_published: new Date()};
      return ArticlesService.updateArticle(db, id, data)
        .then(() => ArticlesService.getArticleById(db, id))
        .then(actual => {
          const expected = data;
          expect(actual).to.eql({id, ...expected});
        });
    });
  });

  context('Given \'articles\' has no data', () => {

    it('getAllArticles() resolves an empty array', () => {
      return ArticlesService.getAllArticles(db)
        .then(actual => expect(actual).to.eql([]));
    });

    it('insertArticle() inserts a new article and resolves with an id', () => {
      const newArticle = {
        title: 'test new title',
        content: 'test new content',
        date_published: new Date('2020-01-01T00:00:00.000Z')
      };
      return ArticlesService.insertArticle(db, newArticle)
        .then(actual => expect(actual).to.eql({
          id: 1,
          title: 'test new title',
          content: 'test new content',
          date_published: new Date('2020-01-01T00:00:00.000Z')
        }));
    });
  });
});