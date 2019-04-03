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

config.contentStore.collectionName = 'conditional'
const collectionName = config.contentStore.collectionName
const Stack = Contentstack.Stack(config)
let db

const itemPropertyChecks = (result) => {
  if (result instanceof Array) {
    result.forEach((item) => {
      expect(item).not.toHaveProperty('sys_keys')
      expect(item).not.toHaveProperty('_version')
      expect(item).not.toHaveProperty('content_type_uid')
      expect(item).not.toHaveProperty('created_at')
      expect(item).not.toHaveProperty('updated_at')
    })
    expect(result).toHaveProperty('content_type_uid')
    expect(result).toHaveProperty('locale')
    expect((result as any).locale).toEqual('en-us')
  }
}

describe('# Conditional Operators', () => {
  beforeAll(() => {
    return Stack.connect().then((dbInstance) => {
      db = dbInstance
    })
  })
  beforeAll(() => {
    return db.collection(collectionName).insertMany(authors)
      .then(() => {
        return db.collection(collectionName).insertMany(blogs)
      })
      .then(() => {
        return db.collection(collectionName).insertMany(categories)
      })
      .then(() => {
        return db.collection(collectionName).insertMany(assets)
      })
      .then(() => {
        return db.collection(collectionName).insertMany(content_types)
      })
      .catch((error) => {
        expect(error).toBeNull()
      })
  })
  afterAll(() => {
    return db.collection(collectionName).drop().then(() => {
      return Stack.close()
    })
  })

  describe('check key existence', () => {
    test('.exists()', () => {
      return Stack.contentType('blog')
        .entries()
        .exists('tags')
        .exists('single_file')
        .find()
        .then((result) => {
          (result as any).entries.forEach((entry) => {
            itemPropertyChecks(result)
            expect(result).toHaveProperty('entries')
            expect((result as any).content_type_uid).toEqual('blog')
            expect(entry).toHaveProperty('tags')
            expect(entry).toHaveProperty('single_file')
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('.notExists()', () => {
      return Stack.contentType('blog')
        .entries()
        .notExists('tags')
        .notExists('single_file')
        .find()
        .then((result) => {
          (result as any).entries.forEach((entry) => {
            itemPropertyChecks(result)
            expect(result).toHaveProperty('entries')
            expect((result as any).content_type_uid).toEqual('blog')
            expect(entry).not.toHaveProperty('tags')
            expect(entry).not.toHaveProperty('single_file')
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })
})

