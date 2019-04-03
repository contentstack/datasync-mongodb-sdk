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

config.contentStore.collectionName = 'skip_limit'
const collectionName = config.contentStore.collectionName
const Stack = Contentstack.Stack(config)
let db
let tempVariable

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

  describe('basic', () => {
    test('.limit(1)', () => {
      const limit = 1

      return Stack.contentType('blog')
        .entries()
        .limit(limit)
        .find()
        .then((result) => {
          itemPropertyChecks(result)
          expect(result).toHaveProperty('entries')
          expect((result as any).content_type_uid).toEqual('blog')
          expect((result as any).entries).toHaveLength(limit)
          tempVariable = (result as any).entries[0]
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('.skip(1)', () => {
      const skip = 1

      return Stack.contentType('blog')
      .entries()
      .find()
      .then((r1) => {

        return Stack.contentType('blog')
        .entries()
        .skip(skip)
        .find()
        .then((result) => {
          (result as any).entries.forEach((entry) => {
            expect(entry).not.toMatchObject(tempVariable)
          })
          itemPropertyChecks(result)
          expect(result).toHaveProperty('entries')
          expect((result as any).content_type_uid).toEqual('blog')
          expect((result as any).entries).toHaveLength((r1 as any).entries.length - skip)
        })
      })
      .catch((error) => {
        expect(error).toBeNull()
      })
    })
  })

  describe('skip-limit combination', () => {
    test('.skip(1) + .limit(1)', () => {
      const skip = 1
      const limit = 1

      return Stack.contentType('blog')
      .entries()
      .find()
      .then((r1) => {

        return Stack.contentType('blog')
        .entries()
        .skip(skip)
        .limit(limit)
        .find()
        .then((result) => {
          itemPropertyChecks(result)
          expect(result).toHaveProperty('entries')
          expect((result as any).content_type_uid).toEqual('blog')
          expect((result as any).entries).toHaveLength(limit)
          expect((result as any).entries[0]).not.toMatchObject((r1 as any).entries[0])
        })
      })
      .catch((error) => {
        expect(error).toBeNull()
      })
    })
  })
})

