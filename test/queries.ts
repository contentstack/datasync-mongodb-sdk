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

config.contentStore.collectionName = 'queries'
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

describe('# Querying', () => {
  beforeAll(() => {
    expect.extend({
      compareValue(value, compareValue, operator, strict = false) {
        let pass, comparison
        // if operator is true, value >= compareValue, else the opposite
        if (operator) {
          if (strict) {
            comparison = ' > '
            pass = value > compareValue 
          } else {
            comparison = ' >= '
            pass = value >= compareValue 
          }
        } else {
          if (strict) {
            comparison = ' < '
            pass = value < compareValue 
          } else {
            comparison = ' <= '
            pass = value <= compareValue 
          }
        }
  
        if (pass) {
          return {
            message: () =>
              `expected ${value} not to be ${comparison} than ${compareValue}`,
            pass: true,
          };
        } else {
          return {
            message: () =>
            `expected ${value} to be ${comparison} than ${compareValue}`,
            pass: false,
          };
        }
      },
    })
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

  expect.extend({
    compareValue(value, compareValue, operator, strict = false) {
      let pass, comparison
      // if operator is true, value >= compareValue, else the opposite
      if (operator) {
        if (strict) {
          comparison = ' > '
          pass = value > compareValue 
        } else {
          comparison = ' >= '
          pass = value >= compareValue 
        }
      } else {
        if (strict) {
          comparison = ' < '
          pass = value < compareValue 
        } else {
          comparison = ' <= '
          pass = value <= compareValue 
        }
      }

      if (pass) {
        return {
          message: () =>
            `expected ${value} not to be ${comparison} than ${compareValue}`,
          pass: true,
        };
      } else {
        return {
          message: () =>
          `expected ${value} to be ${comparison} than ${compareValue}`,
          pass: false,
        };
      }
    },
  })

  describe('basic querying', () => {
    test('.query $and', () => {
      return Stack.contentType('blog')
        .entries()
        .query({$and: [{content_type_uid: 'blog'}, {no: 1}]})
        .find()
        .then((result) => {
          (result as any).entries.forEach((entry) => {
            itemPropertyChecks(result)
            expect(result).toHaveProperty('entries')
            expect((result as any).content_type_uid).toEqual('blog')
            expect((result as any).entries).toHaveLength(1)
            expect(entry).toHaveProperty('no')
            expect(entry.no).toEqual(1)
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('.query $or', () => {
      return Stack.contentType('blog')
        .entries()
        .query({$or: [{content_type_uid: 'blogs'}, {no: 1}]})
        .find()
        .then((result) => {
          (result as any).entries.forEach((entry) => {
            itemPropertyChecks(result)
            expect(result).toHaveProperty('entries')
            expect((result as any).content_type_uid).toEqual('blog')
            expect((result as any).entries).toHaveLength(1)
            expect(entry).toHaveProperty('no')
            expect(entry.no).toEqual(1)
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('.tags()', () => {
      return Stack.contentType('blog')
        .entries()
        .tags(['last'])
        .find()
        .then((result) => {
          (result as any).entries.forEach((entry) => {
            itemPropertyChecks(result)
            expect(result).toHaveProperty('entries')
            expect((result as any).content_type_uid).toEqual('blog')
            expect((result as any).entries).toHaveLength(1)
            expect(entry).toHaveProperty('tags')
            expect(entry.tags).toContain('last')
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('.query + .tags()', () => {
      return Stack.contentType('blog')
        .entries()
        .query({$or: [{content_type_uid: 'blogs'}, {tags: {$exists: true}}]})
        .tags(['last'])
        .find()
        .then((result) => {
          (result as any).entries.forEach((entry) => {
            itemPropertyChecks(result)
            expect(result).toHaveProperty('entries')
            expect((result as any).content_type_uid).toEqual('blog')
            expect((result as any).entries).toHaveLength(1)
            expect(entry).toHaveProperty('tags')
            expect(entry.tags).toContain('last')
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })
})

