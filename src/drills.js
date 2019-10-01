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
    .then(res => console.log('q1: ',res))
    .finally(() => db.destroy());
};

const getPaginatedItems = pageNumber => {
  const offset = (pageNumber - 1) * 6;
  db
    .select('*')
    .from('shopping_list')
    .limit(6)
    .offset(offset)
    .then(res => console.log('q2: ',res))
    .finally(() => db.destroy());
};

const getItemsFromDay = daysAgo => {
  db
    .select('*')
    .from('shopping_list')
    .where('date_added', '>', knex.raw(`now() - '?? days'::INTERVAL`, daysAgo))
    .then(res => console.log('q3: ',res))
    .finally(() => db.destroy());
};

const totalCostForCategory = () => {
  db
    .select('category')
    .sum('price AS totalPrice')
    .from('shopping_list')
    .groupBy('category')
    .then(res => console.log('q4: ',res))
    .finally(() => db.destroy());

};


fetchItemsByTerm('bl');
getPaginatedItems(2);
getItemsFromDay(4);
totalCostForCategory();