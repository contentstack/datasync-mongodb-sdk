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

config.contentStore.collectionName = 'references'
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

describe('# References', () => {
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

  describe('basic', () => {
    test('.includeReferences()', () => {
      return Stack.contentType('blog')
        .entries()
        .includeReferences()
        .find()
        .then((result) => {
          (result as any).entries.forEach((entry) => {
            itemPropertyChecks(result)
            expect(result).toHaveProperty('entries')
            expect((result as any).content_type_uid).toEqual('blog')
            expect((result as any).entries).toHaveLength(5)
            expect(entry).toHaveProperty('authors')
            // expect(entry.authors).toHaveProperty('uid')
            // expect(entry.authors.uid).toEqual('a10')
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('.queryOnReferences()', () => {
      return Stack.contentType('blog')
        .entries()
        .queryReferences({'authors.uid': 'a10'})
        .find()
        .then((result) => {
          (result as any).entries.forEach((entry) => {
            itemPropertyChecks(result)
            expect(result).toHaveProperty('entries')
            expect((result as any).content_type_uid).toEqual('blog')
            expect((result as any).entries).toHaveLength(1)
            expect(entry).toHaveProperty('authors')
            expect(entry.authors).toHaveProperty('uid')
            expect(entry.authors.uid).toEqual('a10')
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('.include()', () => {
      return Stack.contentType('blog')
        .entries()
        .include(['authors'])
        .find()
        .then((result) => {
          (result as any).entries.forEach((entry) => {
            itemPropertyChecks(result)
            expect(result).toHaveProperty('entries')
            expect((result as any).content_type_uid).toEqual('blog')
            expect((result as any).entries).toHaveLength(5)
            expect(entry).not.toHaveProperty('self_reference')
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })
})

