const knex = require('knex');
require('dotenv').config();

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL,
});

console.log('knex and driver installed correctly');

const searchByProductName = (term) => {
  const searchTerm = term;
  knexInstance
    .select('product_id', 'name', 'price', 'category')
    .from('amazong_products')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then(res => console.log(res));
};

const fetchPaginatedProducts = (page = 1) => {
  knexInstance
    .select('product_id', 'name', 'price', 'category')
    .from('amazong_products')
    .limit(10)
    .offset((page - 1) * 10)
    .then(res => console.log(res));
};

const filterProductsForImageExists = () => {
  knexInstance
    .select('product_id', 'name', 'price', 'category', 'image')
    .from('amazong_products')
    .whereNotNull('image')
    .then(res => console.log(res));
};

const filterForMostViewedCurrentMonth = (days) => {
  let query = knexInstance
    .select('video_name', 'region')
    .count('date_viewed AS views')
    .from('whopipe_video_views')
    .where('date_viewed', '>', knexInstance.raw(`now() - '?? days'::INTERVAL`, days))
    .groupBy('video_name', 'region')
    .orderBy([
      {column: 'region', order: 'ASC'},
      {column: 'views', order: 'DESC'}
    ])
    .then(res => console.log(res));
  //   .toQuery();
  // console.log(query);
};
// searchByProductName('game');
// fetchPaginatedProducts(2);
// filterProductsForImageExists();
filterForMostViewedCurrentMonth(30);
