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
collNameConfig.asset = 'contents.references'
collNameConfig.entry = 'contents.references'
collNameConfig.schema = 'content_types.references'

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

describe('# References', () => {

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

  describe('basic', () => {
    test('.includeReferences()', () => {
      return Stack.contentType('blog')
        .entries()
        .includeReferences()
        .find()
        .then((result: any) => {
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(5)
          result.entries.forEach((entry) => {
            expect(entry).toHaveProperty('authors')
            if (entry.authors instanceof Array) {
              entry.authors.forEach((elem) => {
                expect(elem).toHaveProperty('uid')
                expect(elem).toHaveProperty('title')
                expect(elem).not.toHaveProperty('_content_type_uid')
              })
            } else {
              expect(entry.authors).toHaveProperty('uid')
              expect(entry.authors).toHaveProperty('title')
              expect(entry.authors).not.toHaveProperty('_content_type_uid')
            }
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
        .then((result: any) => {
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(1)
          result.entries.forEach((entry) => {
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
        .then((result: any) => {
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(5)
          result.entries.forEach((entry) => {
            if (entry.hasOwnProperty('self_reference')) {
              expect(entry).toHaveProperty('self_reference')
              expect(entry.self_reference instanceof Array).toBeTruthy()
              entry.self_reference.forEach((ref) => {
                expect(ref).toHaveProperty('_content_type_uid')
                expect(ref).toHaveProperty('uid')
              })
            }

            if (entry.hasOwnProperty('authors')) {
              expect(entry).toHaveProperty('authors')
              if (entry.authors instanceof Array) {
                entry.authors.forEach((ref) => {
                  expect(ref).toHaveProperty('title')
                  expect(ref).toHaveProperty('uid')
                  expect(ref).not.toHaveProperty('_version')
                })
              } else {
                expect(entry.authors).toHaveProperty('title')
                expect(entry.authors).toHaveProperty('uid')
                expect(entry.authors).not.toHaveProperty('_version')
              }
            }
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })
})

