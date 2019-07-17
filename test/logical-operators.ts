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
collNameConfig.asset = 'contents.logical_operators'
collNameConfig.entry = 'contents.logical_operators'
collNameConfig.schema = 'content_types.logical_operators'

const Stack = Contentstack.Stack(scriptConfig)
const collection = cloneDeep(collNameConfig)

collection.asset = `en-us.${collNameConfig.asset}`
collection.entry = `en-us.${collNameConfig.entry}`
collection.schema = `en-us.${collNameConfig.schema}`

let db

const itemPropertyChecks = (result) => {
  expect(result).toHaveProperty('entries')
  expect(result).toHaveProperty('locale')
  expect(result).toHaveProperty('content_type_uid')
  expect(result.locale).toEqual('en-us')
  if (result.entries instanceof Array) {
    result.entries.forEach((item) => {
      expect(item).not.toHaveProperty('_version')
      expect(item).not.toHaveProperty('_content_type_uid')
      expect(item).not.toHaveProperty('created_at')
      expect(item).not.toHaveProperty('updated_at')
    })
  }
}

describe('# Logical Operator Querying', () => {

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

  describe('on: non pre-existing operator', () => {
    test('.and()', () => {
      return Stack.contentType('blog')
        .entries()
        .and([{_content_type_uid: 'blog'}, {no: 1}])
        .find()
        .then((result: any) => {
          itemPropertyChecks(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(1)
          result.entries.forEach((entry) => {
            expect(entry).toHaveProperty('no')
            expect(entry.no).toEqual(1)
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('.or()', () => {
      return Stack.contentType('blog')
        .entries()
        .or([{_content_type_uid: 'blogs'}, {no: 1}])
        .find()
        .then((result: any) => {
          itemPropertyChecks(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(1)
          result.entries.forEach((entry) => {
            expect(entry).toHaveProperty('no')
            expect(entry.no).toEqual(1)
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

  })

  describe('on: pre-existing operator', () => {
    test('.and()', () => {
      return Stack.contentType('blog')
        .entries()
        .and([{no: 1}])
        .and([{_content_type_uid: 'blogs'}])
        .find()
        .then((result: any) => {
          itemPropertyChecks(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(0)
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('.or()', () => {
      return Stack.contentType('blog')
        .entries()
        .or([{no: 1}])
        .or([{_content_type_uid: 'blogs'}])
        .find()
        .then((result: any) => {
          itemPropertyChecks(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(0)
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })
})

