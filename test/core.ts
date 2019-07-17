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
import { entries as products } from './data/products'

const scriptConfig = cloneDeep(config)
const collNameConfig: any = scriptConfig.contentStore.collection
collNameConfig.asset = 'contents.core'
collNameConfig.entry = 'contents.core'
collNameConfig.schema = 'content_types.core'

const Stack = Contentstack.Stack(scriptConfig)
const collection = cloneDeep(collNameConfig)
const collection2 = cloneDeep(collNameConfig)

collection.asset = `en-us.${collNameConfig.asset}`
collection.entry = `en-us.${collNameConfig.entry}`
collection.schema = `en-us.${collNameConfig.schema}`

collection2.asset = `es-es.${collNameConfig.asset}`
collection2.entry = `es-es.${collNameConfig.entry}`
collection2.schema = `es-es.${collNameConfig.schema}`

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

const checkAssets = (result: any) => {
  expect(result).toHaveProperty('assets')
  expect(result).toHaveProperty('locale')
  expect(result).toHaveProperty('content_type_uid')
  expect(result.content_type_uid).toEqual('assets')
  expect(result.locale).toEqual('en-us')
  expect(result.assets instanceof Array).toBeTruthy()
  result.assets.forEach((item) => {
    expect(item).not.toHaveProperty('_version')
    expect(item).not.toHaveProperty('_content_type_uid')
    expect(item).not.toHaveProperty('created_at')
    expect(item).not.toHaveProperty('updated_at')
  })
}

describe('# Core', () => {

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
    await db.collection(collection.entry).insertMany(products)
    await db.collection(collection.asset).insertMany(assets)
    await db.collection(collection.schema).insertMany(content_types)

    await db.collection(collection2.entry).insertMany(authors)
    await db.collection(collection2.entry).insertMany(blogs)
    await db.collection(collection2.entry).insertMany(products)
    await db.collection(collection2.asset).insertMany(assets)
    await db.collection(collection2.schema).insertMany(content_types)

    return
  })

  afterAll(async () => {
    await db.collection(collection.entry).drop()
    // await db.collection(collection.asset).drop()
    await db.collection(collection.schema).drop()

    await db.collection(collection2.entry).drop()
    // await db.collection(collection.asset).drop()
    await db.collection(collection2.schema).drop()

    return Stack.close()
  })

  test('initialize stack', () => {
    expect(Contentstack.Stack())
      .toHaveProperty('connect')
  })

  describe('entries', () => {
    test('find', () => {
      return Stack.contentType('blog')
        .entries()
        .find()
        .then((result: any) => {
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(5)
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('find - language', () => {
      return Stack.contentType('product')
        .entries()
        .language('es-es')
        .find()
        .then((result: any) => {
          // checkEntries(result)
          expect(result).toHaveProperty('entries')
          expect(result).toHaveProperty('locale')
          expect(result).toHaveProperty('content_type_uid')
          expect(result.locale).toEqual('es-es')
          expect(result.content_type_uid).toEqual('product')
          expect(result.entries).toHaveLength(1)
          expect(result.entries instanceof Array).toBeTruthy()
          result.entries.forEach((item) => {
            expect(item).not.toHaveProperty('_version')
            expect(item).not.toHaveProperty('_content_type_uid')
            expect(item).not.toHaveProperty('created_at')
            expect(item).not.toHaveProperty('updated_at')
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('findOne', () => {
      return Stack.contentType('blog')
        .entries()
        .findOne()
        .then((result: any) => {
          expect(result).toHaveProperty('entry')
          expect(result).toHaveProperty('content_type_uid')
          expect(result).toHaveProperty('locale')
          expect(result.content_type_uid).toEqual('blog')
          expect(result.locale).toEqual('en-us')
          expect(result.entry).toHaveProperty('title')
          expect(result.entry).not.toHaveProperty('_version')
          expect(result.entry).not.toHaveProperty('content_type_uid')
          expect(result.entry).not.toHaveProperty('created_at')
          expect(result.entry).not.toHaveProperty('updated_at')
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('count', () => {
      return Stack.contentType('blog')
        .entries()
        .count()
        .then((result: any) => {
          expect(result).toHaveProperty('count')
          expect(result.count).toEqual(5)
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })

  describe('assets', () => {
    test('find', () => {
      return Stack.assets()
        .find()
        .then((result: any) => {
          checkAssets(result)
          expect(result.assets).toHaveLength(3)
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('findOne', () => {
      return Stack.assets()
        .findOne()
        .then((result: any) => {
          expect(result).toHaveProperty('asset')
          expect(result).toHaveProperty('content_type_uid')
          expect(result).toHaveProperty('locale')
          expect(result.content_type_uid).toEqual('assets')
          expect(result.locale).toEqual('en-us')
          expect(result.asset).toHaveProperty('title')
          expect(result.asset).not.toHaveProperty('_version')
          expect(result.asset).not.toHaveProperty('_content_type_uid')
          expect(result.asset).not.toHaveProperty('created_at')
          expect(result.asset).not.toHaveProperty('updated_at')
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('count', () => {
      return Stack.assets()
        .count()
        .then((result: any) => {
          expect(result).toHaveProperty('count')
          expect(result.count).toEqual(3)
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })

  describe('schemas', () => {
    test('find', () => {
      return Stack.schemas()
        .find()
        .then((result: any) => {
          expect(result).toHaveProperty('locale')
          expect(result.locale).toEqual('en-us')
          expect(result).toHaveProperty('content_types')
          expect(result.content_type_uid).toEqual('content_types')
          expect(result.content_types instanceof Array).toBeTruthy()
          expect(result.content_types).toHaveLength(4)
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('findOne', () => {
      return Stack.schemas()
        .findOne()
        .then((result: any) => {
          expect(result).toHaveProperty('content_type')
          expect(result.content_type_uid).toEqual('content_types')
          expect(result.content_type).toHaveProperty('title')
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('count', () => {
      return Stack.schemas()
        .count()
        .then((result: any) => {
          expect(result).toHaveProperty('count')
          expect(result).toHaveProperty('locale')
          expect(result.locale).toEqual('en-us')
          expect(result.count).toEqual(4)
          expect(Object.keys(result).length).toEqual(2)
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })

  describe('entry', () => {
    test('find', () => {
      return Stack.contentType('blog')
        .entry()
        .find()
        .then((result: any) => {
          expect(result).toHaveProperty('entry')
          expect(result).toHaveProperty('content_type_uid')
          expect(result).toHaveProperty('locale')
          expect(result.content_type_uid).toEqual('blog')
          expect(result.locale).toEqual('en-us')
          expect(result.entry).toHaveProperty('title')
          expect(result.entry).not.toHaveProperty('sys_keys')
          expect(result.entry).not.toHaveProperty('_version')
          expect(result.entry).not.toHaveProperty('content_type_uid')
          expect(result.entry).not.toHaveProperty('created_at')
          expect(result.entry).not.toHaveProperty('updated_at')
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })

  describe('asset', () => {
    test('find', () => {
      return Stack.asset()
        .find()
        .then((result: any) => {
          expect(result).toHaveProperty('asset')
          expect(result).toHaveProperty('content_type_uid')
          expect(result).toHaveProperty('locale')
          expect(result.content_type_uid).toEqual('assets')
          expect(result.locale).toEqual('en-us')
          expect(result.asset).toHaveProperty('title')
          expect(result.asset).not.toHaveProperty('sys_keys')
          expect(result.asset).not.toHaveProperty('_version')
          expect(result.asset).not.toHaveProperty('content_type_uid')
          expect(result.asset).not.toHaveProperty('created_at')
          expect(result.asset).not.toHaveProperty('updated_at')
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })

  describe('schema', () => {
    test('find', () => {
      return Stack.schema()
        .find()
        .then((result: any) => {
          expect(result).toHaveProperty('locale')
          expect(result).toHaveProperty('content_type')
          expect(result).toHaveProperty('content_type_uid')
          expect(result.locale).toEqual('en-us')
          expect(result.content_type_uid).toEqual('content_types')
          expect(result.content_type).toHaveProperty('title')
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('count', () => {
      return Stack.schemas()
        .count()
        .then((result: any) => {
          expect(result).toHaveProperty('count')
          expect(result.count).toEqual(4)
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })
})

