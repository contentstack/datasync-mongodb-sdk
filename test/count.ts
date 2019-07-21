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
collNameConfig.asset = 'contents.count'
collNameConfig.entry = 'contents.count'
collNameConfig.schema = 'content_types.count'

const Stack = Contentstack.Stack(scriptConfig)
const collection = cloneDeep(collNameConfig)
const blogCount = blogs.length

collection.asset = `en-us.${collNameConfig.asset}`
collection.entry = `en-us.${collNameConfig.entry}`
collection.schema = `en-us.${collNameConfig.schema}`

let db

describe('# Count', () => {

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

  describe('basic', () => {
    test('.count()', () => {
      return Stack.contentType('blog')
        .entries()
        .count()
        .then((result: any) => {
          expect(result).toHaveProperty('count')
          expect(result).toHaveProperty('locale')
          expect(result).toHaveProperty('content_type_uid')
          expect(result.locale).toEqual('en-us')
          expect(result.content_type_uid).toEqual('blog')
          expect(result.count).toEqual(blogCount)
          expect(Object.keys(result)).toHaveLength(3)
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })

  describe('querying', () => {
    test('.count() + .queryReferences()', () => {
      return Stack.contentType('blog')
        .entries()
        .include(['authors'])
        .queryReferences({'authors.published_at': '2019-01-25T11:47:50.760Z'})
        .count()
        .then((result: any) => {
          expect(result).toHaveProperty('count')
          expect(result).toHaveProperty('locale')
          expect(result).toHaveProperty('content_type_uid')
          expect(result.locale).toEqual('en-us')
          expect(result.content_type_uid).toEqual('blog')
          expect(result.count).toEqual(1)
          expect(Object.keys(result)).toHaveLength(3)
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })
})

