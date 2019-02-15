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

config.collectionName = 'sorting'

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

describe('# Sorting', () => {
  beforeAll(() => {
    expect.extend({
      compareValue(value, compareValue, operator, strict = false) {
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
          };
        } else {
          return {
            message: () =>
            `expected ${value} to be ${comparison} than ${compareValue}`,
            pass: false,
          };
        }
      },
    })
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

  expect.extend({
    compareValue(value, compareValue, operator, strict = false) {
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
        };
      } else {
        return {
          message: () =>
          `expected ${value} to be ${comparison} than ${compareValue}`,
          pass: false,
        };
      }
    },
  })

  describe('on field', () => {
    test('ascending', () => {
      return Stack.contentType('blog')
        .entries()
        .ascending('no')
        .find()
        .then((result) => {
          (result as any).entries.forEach((entry, index) => {
            itemPropertyChecks(result)
            expect(result).toHaveProperty('entries')
            expect((result as any).content_type_uid).toEqual('blog')
            expect((result as any).entries).toHaveLength(5)
            
            if (index === ((result as any).entries.length - 1)) {
              index -= 1
            }
            (expect(entry.no) as any).compareValue((result as any).entries[index + 1].no, false)
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('descending', () => {
      return Stack.contentType('blog')
        .entries()
        .descending('no')
        .find()
        .then((result) => {
          (result as any).entries.forEach((entry, index) => {
            itemPropertyChecks(result)
            expect(result).toHaveProperty('entries')
            expect((result as any).content_type_uid).toEqual('blog')
            expect((result as any).entries).toHaveLength(5)
            
            if (index === ((result as any).entries.length - 1)) {
              index -= 1
            }
            (expect(entry.no) as any).compareValue((result as any).entries[index + 1].no, true)
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })

  describe('without field', () => {
    test('ascending', () => {
      return Stack.contentType('blog')
        .entries()
        .ascending()
        .find()
        .then((result) => {
          (result as any).entries.forEach((entry, index) => {
            itemPropertyChecks(result)
            expect(result).toHaveProperty('entries')
            expect((result as any).content_type_uid).toEqual('blog')
            expect((result as any).entries).toHaveLength(5)
            
            if (index === ((result as any).entries.length - 1)) {
              index -= 1
            }
            (expect(entry.published_at) as any).compareValue((result as any).entries[index + 1].published_at, false)
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('descending', () => {
      return Stack.contentType('blog')
        .entries()
        .descending()
        .find()
        .then((result) => {
          (result as any).entries.forEach((entry, index) => {
            itemPropertyChecks(result)
            expect(result).toHaveProperty('entries')
            expect((result as any).content_type_uid).toEqual('blog')
            expect((result as any).entries).toHaveLength(5)
            
            if (index === ((result as any).entries.length - 1)) {
              index -= 1
            }
            (expect(entry.published_at) as any).compareValue((result as any).entries[index + 1].published_at, true)
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })

  describe('combination - without fields', () => {
    test('.ascending() + .descending()', () => {
      return Stack.contentType('blog')
        .entries()
        .ascending()
        .descending()
        .find()
        .then((result) => {
          (result as any).entries.forEach((entry, index) => {
            itemPropertyChecks(result)
            expect(result).toHaveProperty('entries')
            expect((result as any).content_type_uid).toEqual('blog')
            expect((result as any).entries).toHaveLength(5)
            
            if (index === ((result as any).entries.length - 1)) {
              index -= 1
            }
            (expect(entry.published_at) as any).compareValue((result as any).entries[index + 1].published_at, true)
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('.descending() + .ascending()', () => {
      return Stack.contentType('blog')
        .entries()
        .descending()
        .ascending()
        .find()
        .then((result) => {
          (result as any).entries.forEach((entry, index) => {
            itemPropertyChecks(result)
            expect(result).toHaveProperty('entries')
            expect((result as any).content_type_uid).toEqual('blog')
            expect((result as any).entries).toHaveLength(5)
            
            if (index === ((result as any).entries.length - 1)) {
              index -= 1
            }
            (expect(entry.published_at) as any).compareValue((result as any).entries[index + 1].published_at, false)
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })

  describe('combination - with fields', () => {
    test('.ascending() + .descending()', () => {
      return Stack.contentType('blog')
        .entries()
        .ascending('no')
        .descending('no')
        .find()
        .then((result) => {
          (result as any).entries.forEach((entry, index) => {
            itemPropertyChecks(result)
            expect(result).toHaveProperty('entries')
            expect((result as any).content_type_uid).toEqual('blog')
            expect((result as any).entries).toHaveLength(5)
            
            if (index === ((result as any).entries.length - 1)) {
              index -= 1
            }
            (expect(entry.no) as any).compareValue((result as any).entries[index + 1].no, true)
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('.descending() + .ascending()', () => {
      return Stack.contentType('blog')
        .entries()
        .descending('no')
        .ascending('no')
        .find()
        .then((result) => {
          (result as any).entries.forEach((entry, index) => {
            itemPropertyChecks(result)
            expect(result).toHaveProperty('entries')
            expect((result as any).content_type_uid).toEqual('blog')
            expect((result as any).entries).toHaveLength(5)
            
            if (index === ((result as any).entries.length - 1)) {
              index -= 1
            }
            (expect(entry.no) as any).compareValue((result as any).entries[index + 1].no, false)
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })
})

