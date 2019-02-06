/**
 * @description Test contentstack-mongodb-sdk basic methods
 */

import { Contentstack } from '../src/contentstack'
import { config } from './config'
import { entries as authors } from './data/author'
import { entries as blogs } from './data/blog'
import { entries as categories } from './data/category'

const Stack = Contentstack.Stack(config)
let db

describe('core', () => {
  beforeAll(() => {
    return Stack.connect({dbName: 'sync-test'}).then((dbInstance) => {
      db = dbInstance
    })
  })
  afterAll(() => {
    return Stack.close()
  })

  test('initialize stack', () => {
    expect(Contentstack.Stack()).toHaveProperty('connect')
  })

  // test('connect', () => {
  //   Stack.connect().then((dbInstance) => {
  //     // db = dbInstance
  //     // const keys = ['insertMany', 'insertOne', 'updateOne', 'updateMany', 'deleteOne', 'deleteMany']
  //     // keys.forEach((key) => {
  //     //   expect(dbInstance).toHaveProperty(key)
  //     // })
  //   }).catch((error) => {
  //     expect(error).toBeNull()
  //   })
  // })

  test('db inserts', () => {
    return db.collection('contents').insertMany(authors)
      .then(() => {
        return db.collection('contents').insertMany(blogs)
      })
      .then(() => {
        return db.collection('contents').insertMany(categories)
      })
      .catch((error) => {
        expect(error).toBeNull()
      })
  })
})

