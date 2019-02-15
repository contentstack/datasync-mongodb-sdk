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

config.collectionName = 'expressions'

const Stack = Contentstack.Stack(config)
let db

function fnWhere () {
  return (this.no === 1)
}

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

describe('# Expressional Operators', () => {
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
    // return db.collection(config.collectionName).drop().then(() => {
    //   return Stack.close()
    // })
  })

  describe('basic', () => {
    test('.where()', () => {
      return Stack.contentType('blog')
        .entries()
        .where(fnWhere)
        .find()
        .then((result) => {
          (result as any).entries.forEach((entry) => {
            expect(entry).toHaveProperty('no')
            expect(entry.no).toEqual(1)
          })
          itemPropertyChecks(result)
          expect(result).toHaveProperty('entries')
          expect((result as any).content_type_uid).toEqual('blog')
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('.regex()', () => {
      return Stack.contentType('blog')
        .entries()
        .regex('title', '/^Blog Two$/', 'g')
        .find()
        .then((result) => {
          (result as any).entries.forEach((entry) => {
            itemPropertyChecks(result)
            expect(result).toHaveProperty('entries')
            expect((result as any).content_type_uid).toEqual('blog')
            expect(entry).toHaveProperty('title')
            expect(entry.title).toMatch(/^Blog Two$/)
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })
})

