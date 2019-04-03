/**
 * @description Test contentstack-mongodb-sdk basic methods
 */

import { Contentstack } from '../src'
import { config } from './config'
import { assets } from './data/assets'
import { entries as authors } from './data/author'
import { entries as blogs } from './data/blog'
import { entries as categories } from './data/category'
import { entries as products } from './data/products'
import { content_types } from './data/content_types'

config.contentStore.collectionName = 'core'
const collectionName = config.contentStore.collectionName
const Stack = Contentstack.Stack(config)
let db

describe('# Core', () => {
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
      return db.collection(collectionName).insertMany(products)
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

  test('initialize stack', () => {
    expect(Contentstack.Stack()).toHaveProperty('connect')
  })

  describe('entries', () => {
    test('find', () => {
      return Stack.contentType('blog')
        .entries()
        .find()
        .then((result) => {
          (result as any).entries.forEach((entry) => {
            expect(entry).not.toHaveProperty('sys_keys')
            expect(entry).not.toHaveProperty('_version')
            expect(entry).not.toHaveProperty('content_type_uid')
            expect(entry).not.toHaveProperty('created_at')
            expect(entry).not.toHaveProperty('updated_at')
            expect(result).toHaveProperty('entries')
            expect(result).toHaveProperty('content_type_uid')
            expect(result).toHaveProperty('locale')
            expect((result as any).content_type_uid).toEqual('blog')
            expect((result as any).locale).toEqual('en-us')
            expect((result as any).entries).toHaveLength(5)
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('find - language', () => {
      return Stack.contentType('product')
        .entries()
        .language('es-es')
        .find()
        .then((result) => {
          (result as any).entries.forEach((entry) => {
            expect(entry).not.toHaveProperty('sys_keys')
            expect(entry).not.toHaveProperty('_version')
            expect(entry).not.toHaveProperty('content_type_uid')
            expect(entry).not.toHaveProperty('created_at')
            expect(entry).not.toHaveProperty('updated_at')
            expect(result).toHaveProperty('entries')
            expect(result).toHaveProperty('content_type_uid')
            expect(result).toHaveProperty('locale')
            expect((result as any).content_type_uid).toEqual('product')
            expect((result as any).locale).toEqual('es-es')
            expect((result as any).entries).toHaveLength(1)
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('findOne', () => {
      return Stack.contentType('blog')
        .entries()
        .findOne()
        .then((result) => {
          expect(result).toHaveProperty('entry')
          expect(result).toHaveProperty('content_type_uid')
          expect(result).toHaveProperty('locale')
          expect((result as any).content_type_uid).toEqual('blog')
          expect((result as any).locale).toEqual('en-us')
          expect((result as any).entry).toHaveProperty('title')
          expect((result as any).entry).not.toHaveProperty('sys_keys')
          expect((result as any).entry).not.toHaveProperty('_version')
          expect((result as any).entry).not.toHaveProperty('content_type_uid')
          expect((result as any).entry).not.toHaveProperty('created_at')
          expect((result as any).entry).not.toHaveProperty('updated_at')
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('count', () => {
      return Stack.contentType('blog')
        .entries()
        .count()
        .then((result) => {
          expect(result).toHaveProperty('count')
          expect((result as any).count).toEqual(5)
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })

  describe('assets', () => {
    test('find', () => {
      return Stack.assets()
        .find()
        .then((result) => {
          (result as any).assets.forEach((asset) => {
            expect(asset).not.toHaveProperty('sys_keys')
            expect(asset).not.toHaveProperty('_version')
            expect(asset).not.toHaveProperty('content_type_uid')
            expect(asset).not.toHaveProperty('created_at')
            expect(asset).not.toHaveProperty('updated_at')
            expect(result).toHaveProperty('assets')
            expect(result).toHaveProperty('content_type_uid')
            expect(result).toHaveProperty('locale')
            expect((result as any).content_type_uid).toEqual('assets')
            expect((result as any).locale).toEqual('en-us')
            expect((result as any).assets).toHaveLength(3)
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('findOne', () => {
      return Stack.assets()
        .findOne()
        .then((result) => {
          expect(result).toHaveProperty('asset')
          expect(result).toHaveProperty('content_type_uid')
          expect(result).toHaveProperty('locale')
          expect((result as any).content_type_uid).toEqual('assets')
          expect((result as any).locale).toEqual('en-us')
          expect((result as any).asset).toHaveProperty('title')
          expect((result as any).asset).not.toHaveProperty('sys_keys')
          expect((result as any).asset).not.toHaveProperty('_version')
          expect((result as any).asset).not.toHaveProperty('content_type_uid')
          expect((result as any).asset).not.toHaveProperty('created_at')
          expect((result as any).asset).not.toHaveProperty('updated_at')
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('count', () => {
      return Stack.assets()
        .count()
        .then((result) => {
          expect(result).toHaveProperty('count')
          expect((result as any).count).toEqual(3)
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })

  describe('schemas', () => {
    test('find', () => {
      return Stack.schemas()
        .find()
        .then((result) => {
          expect(result).toHaveProperty('content_types')
          expect(result).toHaveProperty('content_type_uid')
          expect((result as any).content_type_uid).toEqual('content_types')
          expect((result as any).content_types).toHaveLength(3)
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('findOne', () => {
      return Stack.schemas()
        .findOne()
        .then((result) => {
          expect(result).toHaveProperty('content_type')
          expect(result).toHaveProperty('content_type_uid')
          expect((result as any).content_type_uid).toEqual('content_types')
          expect((result as any).content_type).toHaveProperty('title')
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('count', () => {
      return Stack.schemas()
        .count()
        .then((result) => {
          expect(result).toHaveProperty('count')
          expect((result as any).count).toEqual(3)
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
        .then((result) => {
          expect(result).toHaveProperty('entry')
          expect(result).toHaveProperty('content_type_uid')
          expect(result).toHaveProperty('locale')
          expect((result as any).content_type_uid).toEqual('blog')
          expect((result as any).locale).toEqual('en-us')
          expect((result as any).entry).toHaveProperty('title')
          expect((result as any).entry).not.toHaveProperty('sys_keys')
          expect((result as any).entry).not.toHaveProperty('_version')
          expect((result as any).entry).not.toHaveProperty('content_type_uid')
          expect((result as any).entry).not.toHaveProperty('created_at')
          expect((result as any).entry).not.toHaveProperty('updated_at')
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })

  describe('asset', () => {
    test('find', () => {
      return Stack.asset()
        .find()
        .then((result) => {
          expect(result).toHaveProperty('asset')
          expect(result).toHaveProperty('content_type_uid')
          expect(result).toHaveProperty('locale')
          expect((result as any).content_type_uid).toEqual('assets')
          expect((result as any).locale).toEqual('en-us')
          expect((result as any).asset).toHaveProperty('title')
          expect((result as any).asset).not.toHaveProperty('sys_keys')
          expect((result as any).asset).not.toHaveProperty('_version')
          expect((result as any).asset).not.toHaveProperty('content_type_uid')
          expect((result as any).asset).not.toHaveProperty('created_at')
          expect((result as any).asset).not.toHaveProperty('updated_at')
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })

  describe('schema', () => {
    test('find', () => {
      return Stack.schema()
        .find()
        .then((result) => {
          expect(result).toHaveProperty('content_type')
          expect(result).toHaveProperty('content_type_uid')
          expect((result as any).content_type_uid).toEqual('content_types')
          expect((result as any).content_type).toHaveProperty('title')
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('count', () => {
      return Stack.schemas()
        .count()
        .then((result) => {
          expect(result).toHaveProperty('count')
          expect((result as any).count).toEqual(3)
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })
})

