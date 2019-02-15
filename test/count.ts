/**
 * @description Test contentstack-mongodb-sdk basic methods
 */

import { Contentstack } from '../src'
import { config } from './config'
import { assets } from './data/assets'
import { entries as authors } from './data/author'
import { entries as blogs } from './data/blog'
import { entries as categories } from './data/category'
import { content_types } from './data/content_types'

config.collectionName = 'count'

const Stack = Contentstack.Stack(config)
const blogsCount = blogs.length
let db

describe('# Count', () => {
  beforeAll(() => {
    return Stack.connect().then((dbInstance) => {
      db = dbInstance
    })
  })
  beforeAll(() => {
    return db.collection(config.collectionName).insertMany(authors)
      .then(() => {
        return db.collection(config.collectionName).insertMany(blogs)
      })
      .then(() => {
        return db.collection(config.collectionName).insertMany(categories)
      })
      .then(() => {
        return db.collection(config.collectionName).insertMany(assets)
      })
      .then(() => {
        return db.collection(config.collectionName).insertMany(content_types)
      })
      .catch((error) => {
        expect(error).toBeNull()
      })
  })
  afterAll(() => {
    return db.collection(config.collectionName).drop().then(() => {
      return Stack.close()
    })
  })

  describe('basic', () => {
    test('.count()', () => {
      return Stack.contentType('blog')
        .entries()
        .count()
        .then((result) => {
          expect(result).toHaveProperty('count')
          expect((result as any).count).toEqual(blogsCount)
          expect(Object.keys(result)).toHaveLength(1)
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })

  describe('querying', () => {
    test('.count() + .queryReferences()', () => {
      return Stack.contentType('blog')
        .entries()
        .queryReferences({'authors.uid': 'a10'})
        .count()
        .then((result) => {
          expect(result).toHaveProperty('count')
          expect((result as any).count).toEqual(1)
          expect(Object.keys(result)).toHaveLength(1)
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })
})

