/**
 * @description Test contentstack-mongodb-sdk basic methods
 */

import { cloneDeep } from 'lodash'
import { Contentstack } from '../src'
import { config } from './config'
import { assets } from './data/assets'
import { entries as authors } from './data/author'
import { entries as blogs } from './data/blog'
import { entries as categories } from './data/category'
import { content_types } from './data/content_types'

const scriptConfig = cloneDeep(config)
const collNameConfig: any = scriptConfig.contentStore.collection
collNameConfig.asset = 'contents.sorting'
collNameConfig.entry = 'contents.sorting'
collNameConfig.schema = 'content_types.sorting'

const Stack = Contentstack.Stack(scriptConfig)
const collection = cloneDeep(collNameConfig)

collection.asset = `en-us.${collNameConfig.asset}`
collection.entry = `en-us.${collNameConfig.entry}`
collection.schema = `en-us.${collNameConfig.schema}`

let db

const checkEntries = (result: any) => {
  expect(result).toHaveProperty('entries')
  expect(result).toHaveProperty('locale')
  expect(result).toHaveProperty('content_type_uid')
  expect(result.locale).toEqual('en-us')
  expect(result.entries instanceof Array).toBeTruthy()
  result.entries.forEach((item) => {
    expect(item).not.toHaveProperty('_version')
    expect(item).not.toHaveProperty('_content_type_uid')
    expect(item).not.toHaveProperty('created_at')
    expect(item).not.toHaveProperty('updated_at')
  })
}

describe('# Sorting', () => {

  beforeAll(() => {
    return Stack.connect().then((dbInstance) => {
      db = dbInstance
    })
  })


  beforeAll(() => {
    return Stack.connect().then((dbInstance) => {
      db = dbInstance

      return
    })
  })

  beforeAll(async () => {
    await db.collection(collection.entry).insertMany(authors)
    await db.collection(collection.entry).insertMany(blogs)
    await db.collection(collection.entry).insertMany(categories)
    await db.collection(collection.asset).insertMany(assets)
    await db.collection(collection.schema).insertMany(content_types)

    return
  })

  afterAll(async () => {
    await db.collection(collection.entry).drop()
    // await db.collection(collection.asset).drop()
    await db.collection(collection.schema).drop()

    return Stack.close()
  })

  expect.extend({
    compareValue(value, compareValue, operator, strict = false) {
      // tslint:disable-next-line: one-variable-per-declaration
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
        }
      } else {
        return {
          message: () =>
          `expected ${value} to be ${comparison} than ${compareValue}`,
          pass: false,
        }
      }
    },
  })

  describe('on field', () => {
    test('ascending', () => {
      return Stack.contentType('blog')
        .entries()
        .ascending('no')
        .find()
        .then((result: any) => {
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(5)
          result.entries.forEach((entry, index) => {

            if (index === (result.entries.length - 1)) {
              index -= 1
            }
            (expect(entry.no) as any).compareValue(result.entries[index + 1].no, false)
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('descending', () => {
      return Stack.contentType('blog')
        .entries()
        .descending('no')
        .find()
        .then((result: any) => {
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(5)
          result.entries.forEach((entry, index) => {
            if (index === (result.entries.length - 1)) {
              index -= 1
            }
            (expect(entry.no) as any).compareValue(result.entries[index + 1].no, true)
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })

  describe('without field', () => {
    test('ascending', () => {
      return Stack.contentType('blog')
        .entries()
        .ascending()
        .find()
        .then((result: any) => {
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(5)
          result.entries.forEach((entry, index) => {
            if (index === (result.entries.length - 1)) {
              index -= 1
            }
            (expect(entry.published_at) as any).compareValue(result.entries[index + 1].published_at, false)
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('descending', () => {
      return Stack.contentType('blog')
        .entries()
        .descending()
        .find()
        .then((result: any) => {
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(5)
          result.entries.forEach((entry, index) => {
            if (index === (result.entries.length - 1)) {
              index -= 1
            }
            (expect(entry.published_at) as any).compareValue(result.entries[index + 1].published_at, true)
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })

  describe('combination - without fields', () => {
    test('.ascending() + .descending()', () => {
      return Stack.contentType('blog')
        .entries()
        .ascending()
        .descending()
        .find()
        .then((result: any) => {
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(5)
          result.entries.forEach((entry, index) => {
            if (index === (result.entries.length - 1)) {
              index -= 1
            }
            (expect(entry.published_at) as any).compareValue(result.entries[index + 1].published_at, true)
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('.descending() + .ascending()', () => {
      return Stack.contentType('blog')
        .entries()
        .descending()
        .ascending()
        .find()
        .then((result: any) => {
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(5)
          result.entries.forEach((entry, index) => {
            if (index === (result.entries.length - 1)) {
              index -= 1
            }
            (expect(entry.published_at) as any).compareValue(result.entries[index + 1].published_at, false)
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })

  describe('combination - with fields', () => {
    test('.ascending() + .descending()', () => {
      return Stack.contentType('blog')
        .entries()
        .ascending('no')
        .descending('no')
        .find()
        .then((result: any) => {
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(5)
          result.entries.forEach((entry, index) => {
            if (index === (result.entries.length - 1)) {
              index -= 1
            }
            (expect(entry.no) as any).compareValue(result.entries[index + 1].no, true)
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('.descending() + .ascending()', () => {
      return Stack.contentType('blog')
        .entries()
        .descending('no')
        .ascending('no')
        .find()
        .then((result: any) => {
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(5)
          result.entries.forEach((entry, index) => {
            if (index === (result.entries.length - 1)) {
              index -= 1
            }
            (expect(entry.no) as any).compareValue(result.entries[index + 1].no, false)
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })
})

