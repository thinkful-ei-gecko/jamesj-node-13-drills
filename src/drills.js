const knex = require('knex');
require('dotenv').config();

const db = knex({
  connection: process.env.DB_URL,
  client: 'pg'
});

const fetchItemsByTerm = searchTerm => {
  db
    .select('*')
    .from('shopping_list')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then(res => console.log(res));
};

const getPaginatedItems = pageNumber => {
  const offset = (pageNumber - 1) * 6;
  db
    .select('*')
    .from('shopping_list')
    .limit(6)
    .offset(offset)
    .then(res => console.log(res));
};

const getItemsFromDay = daysAgo => {
  db
    .select('*')
    .from('shopping_list')
    .where('date_added', '>', knex.raw(`now() - '?? days'::INTERVAL`, daysAgo))
    .then(res => console.log(res));
};

const totalCostForCategory = () => {
  db
    .select('category')
    .sum('price AS totalPrice')
    .from('shopping_list')
    .groupBy('category')
    .then(res => console.log(res));

};


// fetchItemsByTerm('bl');
// getPaginatedItems(2);
// getItemsFromDay(4);
// totalCostForCategory();