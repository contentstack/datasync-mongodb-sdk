/**
 * @description Test contentstack-mongodb-sdk basic methods
 */

import Debug from 'debug'
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
collNameConfig.asset = 'contents.include_exclude'
collNameConfig.entry = 'contents.include_exclude'
collNameConfig.schema = 'content_types.include_exclude'

const Stack = Contentstack.Stack(scriptConfig)
const collection = cloneDeep(collNameConfig)
const debug = new Debug('test:include-exclude')
collection.asset = `en-us.${collNameConfig.asset}`
collection.entry = `en-us.${collNameConfig.entry}`
collection.schema = `en-us.${collNameConfig.schema}`

let db

const itemPropertyChecks = (result) => {
  expect(result).toHaveProperty('entries')
  expect(result).toHaveProperty('locale')
  expect(result).toHaveProperty('content_type_uid')
  expect(result.locale).toEqual('en-us')
  result.entries.forEach((item) => {
    expect(item).not.toHaveProperty('_content_type_uid')
  })
}

describe('# Include Exclude', () => {

  beforeAll(() => {
    return Stack.connect().then((dbInstance) => {
      db = dbInstance
      debug('Stack connected successfully!')

      return
    })
  })

  beforeAll(async () => {
    await db.collection(collection.entry).insertMany(authors)
    await db.collection(collection.entry).insertMany(blogs)
    await db.collection(collection.entry).insertMany(categories)
    await db.collection(collection.asset).insertMany(assets)
    await db.collection(collection.schema).insertMany(content_types)
    debug('Data populated..!')

    return
  })

  afterAll(async () => {
    await db.collection(collection.entry).drop()
    // await db.collection(collection.asset).drop()
    await db.collection(collection.schema).drop()
    debug('Collections dropped..!')

    return Stack.close()
  })

  describe('basic inclusion', () => {
    test('1 .includeCount()', () => {
      return Stack.contentType('blog')
        .entries()
        .includeCount()
        .find()
        .then((result: any) => {
          debug(`# include-exclude: .includeCount() result\n${JSON.stringify(result)}`)
          itemPropertyChecks(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(5)
          expect(result).toHaveProperty('count')
          expect(result.count).toEqual(5)
          result.entries.forEach((entry) => {
            expect(entry).toHaveProperty('no')
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('2 .includeSchema()', () => {
      return Stack.contentType('blog')
        .entries()
        .includeSchema()
        .find()
        .then((result: any) => {
          itemPropertyChecks(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(5)
          expect(result).toHaveProperty('content_type')
          expect(result.content_type).toHaveProperty('uid')
          expect(result.content_type).toHaveProperty('title')
          expect(result.content_type).toHaveProperty('schema')
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('3 .excludeReferences()', () => {
      return Stack.contentType('blog')
        .entries()
        .excludeReferences()
        .find()
        .then((result: any) => {
          itemPropertyChecks(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(5)
          result.entries.forEach((entry) => {
            if (entry.hasOwnProperty('authors')) {
              if (entry.authors instanceof Array) {
                entry.authors.forEach((ref) => {
                  expect(ref).toHaveProperty('_content_type_uid')
                  expect(ref).toHaveProperty('uid')
                })
              } else {
                expect(entry.authors).toHaveProperty('_content_type_uid')
                expect(entry.authors).toHaveProperty('uid')
              }
            }
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })

  describe('combination of include-exclude', () => {
    test('1 .includeCount() + .includeSchema() + .excludeReferences()', () => {
      return Stack.contentType('blog')
        .entries()
        .includeCount()
        .includeSchema()
        .excludeReferences()
        .find()
        .then((result: any) => {
          itemPropertyChecks(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(5)
          expect(result).toHaveProperty('count')
          expect(result.count).toEqual(5)
          expect(result).toHaveProperty('content_type')
          expect(result.content_type).toHaveProperty('uid')
          expect(result.content_type).toHaveProperty('title')
          expect(result.content_type).toHaveProperty('schema')
          result.entries.forEach((entry) => {
            if (entry.authors && entry.authors instanceof Array) {
              entry.authors.forEach((ref) => {
                expect(ref).toHaveProperty('_content_type_uid')
                expect(ref).toHaveProperty('uid')
                expect(ref._content_type_uid).toEqual('author')
              })
            } else {
              expect(entry.authors).toHaveProperty('_content_type_uid')
              expect(entry.authors).toHaveProperty('uid')
              expect(entry.authors._content_type_uid).toEqual('author')
            }
            expect(entry).toHaveProperty('no')
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })
})

