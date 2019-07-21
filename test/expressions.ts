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
collNameConfig.asset = 'contents.expressions'
collNameConfig.entry = 'contents.expressions'
collNameConfig.schema = 'content_types.expressions'

const Stack = Contentstack.Stack(scriptConfig)
const collection = cloneDeep(collNameConfig)

collection.asset = `en-us.${collNameConfig.asset}`
collection.entry = `en-us.${collNameConfig.entry}`
collection.schema = `en-us.${collNameConfig.schema}`

let db

function fnWhere() {
  return (this.no === 1)
}

const checkEntries = (result: any) => {
  expect(result).toHaveProperty('entries')
  expect(result).toHaveProperty('locale')
  expect(result).toHaveProperty('content_type_uid')
  expect(result.locale).toEqual('en-us')
  expect(result.entries instanceof Array).toBeTruthy()
  result.entries.forEach((item) => {
    expect(item).not.toHaveProperty('_content_type_uid')
  })
}

describe('# Expressional Operators', () => {

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
    test('.where()', () => {
      return Stack.contentType('blog')
        .entries()
        .where(fnWhere)
        .find()
        .then((result: any) => {
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          result.entries.forEach((entry) => {
            expect(entry).toHaveProperty('no')
            expect(entry.no).toEqual(1)
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('.regex()', () => {
      return Stack.contentType('blog')
        .entries()
        .regex('title', '/^Blog Two$/', 'g')
        .find()
        .then((result: any) => {
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          result.entries.forEach((entry) => {
            expect(entry).toHaveProperty('title')
            expect(entry.title).toMatch(/^Blog Two$/)
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })
})

