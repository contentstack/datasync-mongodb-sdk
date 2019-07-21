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
collNameConfig.asset = 'contents.comparison_operators'
collNameConfig.entry = 'contents.comparison_operators'
collNameConfig.schema = 'content_types.comparison_operators'

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
    expect(item).not.toHaveProperty('_content_type_uid')
  })
}

describe('# Comparison Operator Querying', () => {

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
    test('.lessThan()', () => {
      return Stack.contentType('blog')
        .entries()
        .lessThan('no', 1)
        .find()
        .then((result: any) => {
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(1)
          result.entries.forEach((entry) => {
            expect(entry).toHaveProperty('no')
            expect(entry.no).toEqual(0)
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('.lessThanOrEqualTo()', () => {
      return Stack.contentType('blog')
        .entries()
        .lessThanOrEqualTo('no', 0)
        .find()
        .then((result: any) => {
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(1)
          result.entries.forEach((entry) => {
            expect(entry).toHaveProperty('no')
            expect(entry.no).toEqual(0)
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('.notEqualTo()', () => {
      return Stack.contentType('blog')
        .entries()
        .notEqualTo('no', 0)
        .find()
        .then((result: any) => {
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(4)
          result.entries.forEach((entry) => {
            expect(entry).toHaveProperty('no')
            expect(entry.no).not.toEqual(0)
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('.greaterThan()', () => {
      return Stack.contentType('blog')
        .entries()
        .greaterThan('no', 5)
        .find()
        .then((result: any) => {
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(1)
          result.entries.forEach((entry) => {
            expect(entry).toHaveProperty('no')
            expect(entry.no).toBeGreaterThan(5)
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('.greaterThanOrEqualTo()', () => {
      return Stack.contentType('blog')
        .entries()
        .greaterThanOrEqualTo('no', 6)
        .find()
        .then((result: any) => {
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(1)
          result.entries.forEach((entry) => {
            expect(entry).toHaveProperty('no')
            expect(entry.no).toBeGreaterThanOrEqual(6)
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('.containedIn()', () => {
      return Stack.contentType('blog')
        .entries()
        .containedIn('tags', ['last'])
        .find()
        .then((result: any) => {
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(1)
          result.entries.forEach((entry) => {
            expect(entry).toHaveProperty('tags')
            expect(entry.tags).toContain('last')
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('.notContainedIn()', () => {
      return Stack.contentType('blog')
        .entries()
        .notContainedIn('tags', ['last'])
        .find()
        .then((result: any) => {
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(4)
          result.entries.forEach((entry) => {
            if (entry.tags) {
              expect(entry.tags).not.toContain('last')
            }
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })

  describe('on: pre-existing operator', () => {
    test('.lessThan() + .lessThanOrEqualTo()', () => {
      return Stack.contentType('blog')
        .entries()
        .lessThanOrEqualTo('no', 0)
        .find()
        .then((result: any) => {
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(1)
          result.entries.forEach((entry) => {
            expect(entry).toHaveProperty('no')
            expect(entry.no).toEqual(0)
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('.notEqualTo() + .greaterThan() + .greaterThanOrEqualTo()', () => {
      return Stack.contentType('blog')
        .entries()
        .notEqualTo('no', 0)
        .greaterThan('no', 5)
        .greaterThanOrEqualTo('no', 6)
        .find()
        .then((result: any) => {
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(1)
          result.entries.forEach((entry) => {
            expect(entry).toHaveProperty('no')
            expect(entry.no).toBeGreaterThanOrEqual(6)
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('.containedIn() + .notContainedIn()', () => {
      return Stack.contentType('blog')
        .entries()
        .containedIn('tags', ['last'])
        .notContainedIn('tags', ['first'])
        .find()
        .then((result: any) => {
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(4)
          result.entries.forEach((entry) => {
            if (entry.tags) {
              expect(entry.tags).not.toContain('first')
            }
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })
})

