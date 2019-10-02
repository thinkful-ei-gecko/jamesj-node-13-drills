require('dotenv').config()
const knex = require('knex')
const ListService = require('../src/shopping-list-service')

const db = knex({
  connection: process.env.TEST_DB_URL,
  client: 'pg',
})

describe('ListService', () => {
  before(() => db('shopping_list').truncate())
  after(() => db('shopping_list').truncate())
  after(() => db.destroy())
  context('expect db with data', () => {
    const testData = [
      {
        id: 1,
        name: 'name 1',
        price: '10.12',
        category: 'Snack',
        checked: false,
        date_added: new Date('2029-01-22T16:28:32.615Z'),
      },
      {
        id: 2,
        name: 'name 2',
        price: '20.12',
        category: 'Main',
        checked: false,
        date_added: new Date('2029-01-19T16:28:32.615Z'),
      },
      {
        id: 3,
        name: 'name 3',
        price: '5.12',
        category: 'Breakfast',
        checked: false,
        date_added: new Date('2029-01-20T16:28:32.615Z'),
      },
    ]
    beforeEach(() => {
      return db('shopping_list').truncate()
    })
    beforeEach(() => {
      return db('shopping_list').insert(testData)
    })
    afterEach(() => {
      return db('shopping_list').truncate()
    })
    it('getList() resolves to expected data', () => {
      return ListService.getList(db).then(data => {
        expect(data).to.eql(testData)
      })
    })
    it('updateListItem() applies updates and resolves to reflect new changes', () => {
      const updatedItemID = testData[0].id
      const updatedData = { name: 'new note name' }
      return ListService.updateListItem(db, updatedItemID, updatedData).then(
        () =>
          ListService.getList(db).then(data => {
            let expected = data.find(item => item.id === updatedItemID)
            expect(expected).to.eql({ ...testData[0], ...updatedData })
          })
      )
    })
    it('deleteListItem() resolves to test data without removed item', () => {
      const deletedItemID = testData[0].id
      const filteredList = testData.filter(item => item.id !== deletedItemID)
      return ListService.deleteListItem(db, deletedItemID).then(() =>
        ListService.getList(db).then(actual => {
          expect(actual).to.eql(filteredList)
        })
      )
    })
  })

  context('expect db without any data', () => {
    before(() => db('shopping_list').truncate())
    it('addListItem() inserts and resolves to reflect new changes', () => {
      const testItem = {
        name: 'add an item',
        price: '13.13',
        category: 'Lunch',
        checked: true,
        date_added: new Date(),
      }
      return ListService.addListItem(db, testItem)
        .then(actual => {
          expect(actual).to.eql({ ...testItem, id: actual.id })
        })
    })
  })
})
