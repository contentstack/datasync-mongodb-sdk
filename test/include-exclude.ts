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

config.contentStore.collectionName = 'include_exclude'
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

describe('# Include Exclude', () => {
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

  describe('basic inclusion', () => {
    test('.includeCount()', () => {
      return Stack.contentType('blog')
        .entries()
        .includeCount()
        .find()
        .then((result) => {
          (result as any).entries.forEach((entry) => {
            itemPropertyChecks(result)
            expect(result).toHaveProperty('entries')
            expect((result as any).content_type_uid).toEqual('blog')
            expect((result as any).entries).toHaveLength(5)
            expect((result as any)).toHaveProperty('count')
            expect((result as any).count).toEqual(5)
            expect(entry).toHaveProperty('no')
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('.includeSchema()', () => {
      return Stack.contentType('blog')
        .entries()
        .includeSchema()
        .find()
        .then((result) => {
          (result as any).entries.forEach(() => {
            itemPropertyChecks(result)
            expect(result).toHaveProperty('entries')
            expect((result as any).content_type_uid).toEqual('blog')
            expect((result as any).entries).toHaveLength(5)
            expect((result as any)).toHaveProperty('content_type')
            expect((result as any).content_type).toHaveProperty('uid')
            expect((result as any).content_type).toHaveProperty('title')
            expect((result as any).content_type).toHaveProperty('schema')
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('.excludeReferences()', () => {
      return Stack.contentType('blog')
        .entries()
        .excludeReferences()
        .find()
        .then((result) => {
          (result as any).entries.forEach((entry) => {
            itemPropertyChecks(result)
            expect(result).toHaveProperty('entries')
            expect((result as any).content_type_uid).toEqual('blog')
            expect((result as any).entries).toHaveLength(5)
            expect(entry.authors).toHaveProperty('reference_to')
            expect(entry.authors.reference_to).toEqual('author')
            expect(entry.authors).toHaveProperty('values')
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })

  describe('combination of include-exclude', () => {
    test('.includeCount() + .includeSchema() + .excludeReferences()', () => {
      return Stack.contentType('blog')
        .entries()
        .includeCount()
        .includeSchema()
        .excludeReferences()
        .find()
        .then((result) => {
          (result as any).entries.forEach((entry) => {
            itemPropertyChecks(result)
            expect(result).toHaveProperty('entries')
            expect((result as any).content_type_uid).toEqual('blog')
            expect((result as any).entries).toHaveLength(5)
            expect((result as any)).toHaveProperty('count')
            expect((result as any).count).toEqual(5)
            expect((result as any)).toHaveProperty('content_type')
            expect((result as any).content_type).toHaveProperty('uid')
            expect((result as any).content_type).toHaveProperty('title')
            expect((result as any).content_type).toHaveProperty('schema')
            expect(entry.authors).toHaveProperty('reference_to')
            expect(entry.authors.reference_to).toEqual('author')
            expect(entry.authors).toHaveProperty('values')
            expect(entry).toHaveProperty('no')
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })
})

