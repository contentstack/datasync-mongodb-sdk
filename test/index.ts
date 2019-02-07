/**
 * @description Test contentstack-mongodb-sdk basic methods
 */

import { Contentstack } from '../src/contentstack'
import { config } from './config'
// import { assets } from './data/assets'
// import { entries as authors } from './data/author'
// import { entries as blogs } from './data/blog'
// import { entries as categories } from './data/category'

const Stack = Contentstack.Stack(config)
// let db

describe('# Core functionality', () => {
  beforeAll(() => {
    return Stack.connect({dbName: 'sync-test'}).then(() => {
      // db = dbInstance
    })
  })
  afterAll(() => {
    return Stack.close()
  })

  test('initialize stack', () => {
    expect(Contentstack.Stack()).toHaveProperty('connect')
  })

  // test('connect', () => {
  //   Stack.connect().then((dbInstance) => {
  //     // db = dbInstance
  //     // const keys = ['insertMany', 'insertOne', 'updateOne', 'updateMany', 'deleteOne', 'deleteMany']
  //     // keys.forEach((key) => {
  //     //   expect(dbInstance).toHaveProperty(key)
  //     // })
  //   }).catch((error) => {
  //     expect(error).toBeNull()
  //   })
  // })

  // test('db inserts', () => {
  //   return db.collection('contents').insertMany(authors)
  //     .then(() => {
  //       return db.collection('contents').insertMany(blogs)
  //     })
  //     .then(() => {
  //       return db.collection('contents').insertMany(categories)
  //     })
  //     .then(() => {
  //       return db.collection('contents').insertMany(assets)
  //     })
  //     .catch((error) => {
  //       expect(error).toBeNull()
  //     })
  // })

  describe('entries', () => {
    test('find', () => {
      return Stack.contentType('blog')
        .entries()
        .find()
        .then((result) => {
          expect(result).toHaveProperty('entries')
          expect(result).toHaveProperty('content_type_uid')
          expect(result).toHaveProperty('locale')
          expect((result as any).content_type_uid).toEqual('blog')
          expect((result as any).locale).toEqual('en-us')
          expect((result as any).entries).toHaveLength(5)
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
          expect(result).toHaveProperty('assets')
          expect(result).toHaveProperty('content_type_uid')
          expect(result).toHaveProperty('locale')
          expect((result as any).content_type_uid).toEqual('assets')
          expect((result as any).locale).toEqual('en-us')
          expect((result as any).assets).toHaveLength(3)
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
})

