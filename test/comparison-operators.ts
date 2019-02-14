/**
 * @description Test contentstack-mongodb-sdk basic methods
 */

import { Contentstack } from '../src'
import { config } from './config'
import { assets } from './data/assets'
import { entries as authors } from './data/author'
import { entries as blogs } from './data/blog'
import { entries as categories } from './data/category'
import { content_types } from './data/content_types'

config.collectionName = 'comparison'

const Stack = Contentstack.Stack(config)
let db

const itemPropertyChecks = (result) => {
  if (result instanceof Array) {
    result.forEach((item) => {
      expect(item).not.toHaveProperty('sys_keys')
      expect(item).not.toHaveProperty('_version')
      expect(item).not.toHaveProperty('content_type_uid')
      expect(item).not.toHaveProperty('created_at')
      expect(item).not.toHaveProperty('updated_at')
    })
    expect(result).toHaveProperty('content_type_uid')
    expect(result).toHaveProperty('locale')
    expect((result as any).locale).toEqual('en-us')
  }
}

describe('# Comparison Operator Querying', () => {
  beforeAll(() => {
    return Stack.connect().then((dbInstance) => {
      db = dbInstance
    })
  })
  beforeAll(() => {
    return db.collection(config.collectionName).insertMany(authors)
      .then(() => {
        return db.collection(config.collectionName).insertMany(blogs)
      })
      .then(() => {
        return db.collection(config.collectionName).insertMany(categories)
      })
      .then(() => {
        return db.collection(config.collectionName).insertMany(assets)
      })
      .then(() => {
        return db.collection(config.collectionName).insertMany(content_types)
      })
      .catch((error) => {
        expect(error).toBeNull()
      })
  })
  afterAll(() => {
    return db.collection(config.collectionName).drop().then(() => {
      return Stack.close()
    })
  })

  describe('on: non pre-existing operator', () => {
    test('.lessThan()', () => {
      return Stack.contentType('blog')
        .entries()
        .lessThan('no', 1)
        .find()
        .then((result) => {
          (result as any).entries.forEach((entry) => {
            itemPropertyChecks(result)
            expect(result).toHaveProperty('entries')
            expect((result as any).content_type_uid).toEqual('blog')
            expect((result as any).entries).toHaveLength(1)
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
        .then((result) => {
          (result as any).entries.forEach((entry) => {
            itemPropertyChecks(result)
            expect(result).toHaveProperty('entries')
            expect((result as any).content_type_uid).toEqual('blog')
            expect((result as any).entries).toHaveLength(1)
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
        .then((result) => {
          (result as any).entries.forEach((entry) => {
            itemPropertyChecks(result)
            expect(result).toHaveProperty('entries')
            expect((result as any).content_type_uid).toEqual('blog')
            expect((result as any).entries).toHaveLength(4)
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
        .then((result) => {
          (result as any).entries.forEach((entry) => {
            itemPropertyChecks(result)
            expect(result).toHaveProperty('entries')
            expect((result as any).content_type_uid).toEqual('blog')
            expect((result as any).entries).toHaveLength(1)
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
        .then((result) => {
          (result as any).entries.forEach((entry) => {
            itemPropertyChecks(result)
            expect(result).toHaveProperty('entries')
            expect((result as any).content_type_uid).toEqual('blog')
            expect((result as any).entries).toHaveLength(1)
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
        .then((result) => {
          (result as any).entries.forEach((entry) => {
            itemPropertyChecks(result)
            expect(result).toHaveProperty('entries')
            expect((result as any).content_type_uid).toEqual('blog')
            expect((result as any).entries).toHaveLength(1)
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
        .then((result) => {
          (result as any).entries.forEach((entry) => {
            itemPropertyChecks(result)
            expect(result).toHaveProperty('entries')
            expect((result as any).content_type_uid).toEqual('blog')
            expect((result as any).entries).toHaveLength(4)
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
        .then((result) => {
          (result as any).entries.forEach((entry) => {
            itemPropertyChecks(result)
            expect(result).toHaveProperty('entries')
            expect((result as any).content_type_uid).toEqual('blog')
            expect((result as any).entries).toHaveLength(1)
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
        .then((result) => {
          (result as any).entries.forEach((entry) => {
            itemPropertyChecks(result)
            expect(result).toHaveProperty('entries')
            expect((result as any).content_type_uid).toEqual('blog')
            expect((result as any).entries).toHaveLength(1)
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
        .then((result) => {
          (result as any).entries.forEach((entry) => {
            itemPropertyChecks(result)
            expect(result).toHaveProperty('entries')
            expect((result as any).content_type_uid).toEqual('blog')
            expect((result as any).entries).toHaveLength(4)
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

