/*!
 * Contentstack Sync Mongodb SDK
 * Copyright (c) 2019 Contentstack LLC
 * MIT Licensed
 */

import { filter, find, map, merge, remove, uniq } from 'lodash'
import { Db, MongoClient } from 'mongodb'
import sift from 'sift'
import { config } from './config'
import { checkCyclic, validateURI } from './util'

/**
 * @class Stack
 * @description Expose SDK query methods on Stack
 * @constructor
 * @description Provides a range of connection/disconnect, filters and projections on mongodb
 * @returns {Stack} Returns an instance of `Stack`
 */
export class Stack {
  private q: any
  private config: any
  private contentStore: any
  private client: any
  private collection: any
  private internal: any
  private db: Db

  constructor(stackConfig, existingDB?) {
    this.config = merge(config, stackConfig)
    this.contentStore = this.config.contentStore
    this.q = {}
    this.internal = {}
    this.db = existingDB
  }

  /**
   * @public
   * @method ascending
   * @summary Sorts the documents based on the 'sort' key
   * @description
   * The sort function requires that the entire sort be able to complete within 32 megabytes.
   * When the sort option consumes more than 32 megabytes, MongoDB will return an error.
   * @param {string} field The field to sort in ascending order
   * @example
   * Stack
   *  .contentType('')
   *  .entries()
   *  .ascending()
   *  .find()
   *  .then((result) => {
   *    // result sorted in ascending manner with respect to 'published_at' field (by default)
   *  })
   *  .catch((error) => {
   *    // handle query errors
   *  })
   * 
   * @returns {Stack} Returns an instance of 'stack'
   */
  public ascending(field?) {
    if (typeof this.q.content_type_uid !== 'string') {
      throw new Error('Kindly call \'.contentType()\' before \.ascending()\'')
    }

    if (!(field) || typeof field !== 'string') {
      // throw new Error('Kindly provide a valid field name for \'.ascending()\'')
      if (this.internal.sort && typeof this.internal.sort === 'object') {
        this.internal.sort.published_at = 1
      } else {
        this.internal.sort = {
          published_at: 1,
        }
      }
    } else {
      if (this.internal.sort && typeof this.internal.sort === 'object') {
        this.internal.sort[field] = 1
      } else {
        this.internal.sort = {
          [field]: 1,
        }
      }
    }

    return this
  }

  /**
   * @public
   * @method descending
   * @summary Sorts the documents based on the 'sort' key
   * @description
   * The sort function requires that the entire sort be able to complete within 32 megabytes.
   * When the sort option consumes more than 32 megabytes, MongoDB will return an error.
   * 
   * @param {string} field The field to sort in descending order
   * @example
   * Stack
   *  .contentType('')
   *  .entries()
   *  .descending('title')
   *  .find()
   *  .then((result) => {
   *    // result sorted in descending manner with respect to 'title' field
   *  })
   *  .catch((error) => {
   *    // handle query errors
   *  })
   * 
   * @returns {Stack} Returns an instance of 'stack'
   */
  public descending(field?) {
    if (typeof this.q.content_type_uid !== 'string') {
      throw new Error('Kindly call \'.contentType()\' before \.descending()\'')
    }

    if (!(field) || typeof field !== 'string') {
      // throw new Error('Kindly provide a valid field name for \'.descending()\'')
      if (this.internal.sort && typeof this.internal.sort === 'object') {
        this.internal.sort.published_at = -1
      } else {
        this.internal.sort = {
          published_at: -1,
        }
      }
    } else {
      if (this.internal.sort && typeof this.internal.sort === 'object') {
        this.internal.sort[field] = -1
      } else {
        this.internal.sort = {
          [field]: -1,
        }
      }
    }

    return this
  }

  /**
   * @public
   * @method connect
   * @summary
   * Establish connection to mongodb
   * 
   * @param {object} overrides Config overrides/mongodb specific config
   * @example
   * Stack
   *  .connect({overrides})
   *  .then((result) => {
   *    // mongodb connection object
   *    // indexes will be created on the collection in the background if provided in config
   *  })
   *  .catch((error) => {
   *    // handle query errors
   *  })
   * 
   * @returns {object} Mongodb 'db' instance
   */
  public connect(overrides = {}) {
    return new Promise((resolve, reject) => {
      try {
        const dbConfig = merge({}, this.config, overrides).contentStore

        const uri = validateURI(dbConfig.uri || dbConfig.url)
        const options = dbConfig.options
        const dbName = dbConfig.dbName
        const client = new MongoClient(uri, options)
        this.client = client

        return client.connect().then(() => {
          this.db = client.db(dbName)

          resolve(this.db)

          // Create indexes in the background
          const bucket: any = []
          const indexes = this.config.contentStore.indexes
          const collectionName = this.config.contentStore.collectionName
          for (let index in indexes) {
            if (indexes[index] === 1 || indexes[index] === -1) {
              bucket.push(this.createIndexes(this.config.contentStore.collectionName, index, indexes[index]))
            }
          }

          Promise.all(bucket)
            .then(() => {
              console.info(`Indexes created successfully in '${collectionName}' collection`)    
            })
            .catch((error) => {
              console.error(`Failed while creating indexes in '${collectionName}' collection`)
              console.error(error)
            })
        }).catch(reject)
      } catch (error) {

        return reject(error)
      }
    })
  }

  private createIndexes (collectionId, index, type) {
    return this.db.collection(collectionId)
      .createIndex({
        [index]: type
      })
      .then(() => {
        console.info(`Index '${index}' created successfully!`)
        return
      })
  }

  /**
   * @public
   * @method close
   * @summary Closes connection with mongodb
   */
  public close() {
    this.client.close()
  }

  /**
   * @method language
   * @description
   * Locale to query on
   * 
   * @param {string} code Query locale's code
   * @example
   * Stack
   *  .contentType('')
   *  .entries()
   *  .language('es-es')
   *  .find()
   *  .then((result) => {
   *    // results in entries fetched from 'es-es' locale
   *    // if not provided, defaults to the 1st locale provided in the 'locales' key, provided in config
   *  })
   *  .catch((error) => {
   *    // handle query errors
   *  })
   * 
   * @returns {Stack} Returns an instance of 'stack'
   */
  public language(code) {
    if (!(code) || typeof code !== 'string' || !(find(this.config.locales, {code}))) {
      throw new Error(`Language queried is invalid ${code}`)
    }
    this.q.locale = code

    return this
  }

  /**
   * @method and
   * @description
   * Logical AND query wrapper
   * 
   * @param {object} queries Query filter
   * @example
   * Stack
   *  .contentType('')
   *  .entries()
   *  .and([
   *    {
   *      title: 'John'
   *    },
   *    {
   *      age: 30
   *    }
   *  ])
   *  .find()
   *  .then((result) => {
   *    // filtered entries, where { title: 'John', age: 30 }
   *  })
   *  .catch((error) => {
   *    // handle query errors
   *  })
   * 
   * @returns {Stack} Returns an instance of 'stack'
   */
  public and(queries) {
    if (this.q.query && typeof this.q.query === 'object') {
      this.q.query = merge(this.q.query, {
        $and: queries,
      })
    } else {
      this.q.query = {
        $and: queries,
      }
    }

    return this
  }

  /**
   * @method or
   * @description
   * Logical OR query wrapper
   * 
   * @param {object} queries Query filter
   * @example
   * Stack
   *  .contentType('')
   *  .entries()
   *  .or([
   *    {
   *      title: 'John'
   *    },
   *    {
   *      title: 'Jane'
   *    }
   *  ])
   *  .find()
   *  .then((result) => {
   *    // filtered entries, where { title: 'John' } OR { title: 'Jane' }
   *  })
   *  .catch((error) => {
   *    // handle query errors
   *  })
   * 
   * @returns {Stack} Returns an instance of 'stack'
   */
  public or(queries) {
    if (this.q.query && typeof this.q.query === 'object') {
      this.q.query = merge(this.q.query, {
        $or: queries,
      })
    } else {
      this.q.query = {
        $or: queries,
      }
    }

    return this
  }

  /**
   * @method lessThan
   * @description
   * Comparison $lt query wrapper
   * 
   * @param {string} key Field to compare against
   * @param {*} value Value to compare with
   * @example
   * Stack
   *  .contentType('')
   *  .entries()
   *  .lessThan('age', 18)
   *  .find()
   *  .then((result) => {
   *    // filtered entries, where { age < 18 }
   *  })
   *  .catch((error) => {
   *    // handle query errors
   *  })
   * 
   * @returns {Stack} Returns an instance of 'stack'
   */
  public lessThan(key, value) {
    if (typeof key !== 'string' || typeof value === 'undefined') {
      throw new Error('Kindly pass valid key and value parameters for \'.lessThan()\'')
    } else if (this.q.query && typeof this.q.query === 'object') {
      this.q.query[key] = {
        $lt: value,
      }
    } else {
      this.q.query = {
        [key]: {
          $lt: value,
        },
      }
    }

    return this
  }

  /**
   * @method lessThanOrEqualTo
   * @description
   * Comparison $lte query wrapper
   * 
   * @param {string} key Field to compare against
   * @param {*} value Value to compare with
   * @example
   * Stack
   *  .contentType('')
   *  .entries()
   *  .lessThanOrEqualTo('age', 18)
   *  .find()
   *  .then((result) => {
   *    // filtered entries, where { age <= 18 }
   *  })
   *  .catch((error) => {
   *    // handle query errors
   *  })
   * 
   * @returns {Stack} Returns an instance of 'stack'
   */
  public lessThanOrEqualTo(key, value) {
    if (typeof key !== 'string' || typeof value === 'undefined') {
      throw new Error('Kindly pass valid key and value parameters for \'.lessThanOrEqualTo()\'')
    } else if (this.q.query && typeof this.q.query === 'object') {
      this.q.query[key] = {
        $lte: value,
      }
    } else {
      this.q.query = {
        [key]: {
          $lte: value,
        },
      }
    }

    return this
  }

  /**
   * @member greaterThan
   * @description
   * Comparison $gt query wrapper
   * 
   * @param {string} key Field to compare against
   * @param {*} value Value to compare with
   * @example
   * Stack
   *  .contentType('')
   *  .entries()
   *  .greaterThan('age', 60)
   *  .find()
   *  .then((result) => {
   *    // filtered entries, where { age > 60 }
   *  })
   *  .catch((error) => {
   *    // handle query errors
   *  })
   * 
   * @returns {Stack} Returns an instance of 'stack'
   */
  public greaterThan(key, value) {
    if (typeof key !== 'string' || typeof value === 'undefined') {
      throw new Error('Kindly pass valid key and value parameters for \'.greaterThan()\'')
    } else if (this.q.query && typeof this.q.query === 'object') {
      this.q.query[key] = {
        $gt: value,
      }
    } else {
      this.q.query = {
        [key]: {
          $gt: value,
        },
      }
    }

    return this
  }

  /**
   * @method greaterThanOrEqualTo
   * @description
   * Comparison $gte query wrapper
   * @param {string} key - Field to compare against
   * @param {*} value - Value to compare with
   * @example
   * Stack
   *  .contentType('')
   *  .entries()
   *  .greaterThanOrEqualTo('age', 60)
   *  .find()
   *  .then((result) => {
   *    // filtered entries, where { age >= 60 }
   *  })
   *  .catch((error) => {
   *    // handle query errors
   *  })
   * 
   * @returns {Stack} Returns an instance of 'stack'
   */
  public greaterThanOrEqualTo(key, value) {
    if (typeof key !== 'string' || typeof value === 'undefined') {
      throw new Error('Kindly pass valid key and value parameters for \'.greaterThanOrEqualTo()\'')
    } else if (this.q.query && typeof this.q.query === 'object') {
      this.q.query[key] = {
        $gte: value,
      }
    } else {
      this.q.query = {
        [key]: {
          $gte: value,
        },
      }
    }

    return this
  }

  /**
   * @method notEqualTo
   * @description
   * Comparison $ne query wrapper
   * @param {string} key Field to compare against
   * @param {*} value Value to compare with
   * @example
   * Stack
   *  .contentType('')
   *  .entries()
   *  .notEqualTo('age', 25)
   *  .find()
   *  .then((result) => {
   *    // filtered entries, where { age != 25 }
   *  })
   *  .catch((error) => {
   *    // handle query errors
   *  })
   * 
   * @returns {Stack} Returns an instance of 'stack'
   */
  public notEqualTo(key, value) {
    if (typeof key !== 'string' || typeof value === 'undefined') {
      throw new Error('Kindly pass valid key and value parameters for \'.notEqualTo()\'')
    } else if (this.q.query && typeof this.q.query === 'object') {
      this.q.query[key] = {
        $ne: value,
      }
    } else {
      this.q.query = {
        [key]: {
          $ne: value,
        },
      }
    }

    return this
  }

  /**
   * @method containedIn
   * @description
   * Comparison $in query wrapper
   * @param {string} key Field to compare against
   * @param {*} value Value to compare with
   * 
   * @example
   * Stack
   *  .contentType('')
   *  .entries()
   *  .containedIn('emails', 'john.doe@some.com')
   *  .find()
   *  .then((result) => {
   *    // filtered entries, where 'john.doe@some.com' exists in 'emails' field (array)
   *  })
   *  .catch((error) => {
   *    // handle query errors
   *  })
   * 
   * @returns {Stack} Returns an instance of 'stack'
   */
  public containedIn(key, value) {
    if (typeof key !== 'string' || typeof value !== 'object' || !(value instanceof Array)) {
      throw new Error('Kindly pass valid key and value parameters for \'.containedIn()\'')
    } else if (this.q.query && typeof this.q.query === 'object') {
      this.q.query[key] = {
        $in: value,
      }
    } else {
      this.q.query = {
        [key]: {
          $in: value,
        },
      }
    }

    return this
  }

  /**
   * @method notContainedIn
   * @description
   * Comparison $nin query wrapper
   * @param {string} key Field to compare against
   * @param {*} value Value to compare with
   * 
   * @example
   * Stack
   *  .contentType('')
   *  .entries()
   *  .notContainedIn('emails', 'john.doe@some.com')
   *  .find()
   *  .then((result) => {
   *    // filtered entries, where 'john.doe@some.com' does not exist in 'emails' field (array)
   *  })
   *  .catch((error) => {
   *    // handle query errors
   *  })
   * 
   * @returns {Stack} Returns an instance of 'stack'
   */
  public notContainedIn(key, value) {
    if (typeof key !== 'string' || typeof value !== 'object' || !(value instanceof Array)) {
      throw new Error('Kindly pass valid key and value parameters for \'.notContainedIn()\'')
    } else if (this.q.query && typeof this.q.query === 'object') {
      this.q.query[key] = {
        $nin: value,
      }
    } else {
      this.q.query = {
        [key]: {
          $nin: value,
        },
      }
    }

    return this
  }

  /**
   * @method exists
   * @description
   * Element $exists query wrapper, checks if a field exists
   * 
   * @param {string} key Field to compare against
   * @param {*} value Value to compare with
   * 
   * @example
   * Stack
   *  .contentType('')
   *  .entries()
   *  .exists('emails')
   *  .find()
   *  .then((result) => {
   *    // filtered entries, where 'emails' property exists
   *  })
   *  .catch((error) => {
   *    // handle query errors
   *  })
   * 
   * @returns {Stack} Returns an instance of 'stack'
   */
  public exists(key) {
    if (typeof key !== 'string') {
      throw new Error('Kindly pass valid key for \'.exists()\'')
    } else if (this.q.query && typeof this.q.query === 'object') {
      this.q.query[key] = {
        $exists: true,
      }
    } else {
      this.q.query = {
        [key]: {
          $exists: true,
        },
      }
    }

    return this
  }

  /**
   * @method notExists
   * @description
   * Property $exists query wrapper, checks if a field does not exists
   * 
   * @param {string} key Field to compare against
   * @param {*} value Value to compare with
   * @example
   * Stack
   *  .contentType('')
   *  .entries()
   *  .notExists('emails')
   *  .find()
   *  .then((result) => {
   *    // filtered entries, where 'emails' property does not exist
   *  })
   *  .catch((error) => {
   *    // handle query errors
   *  })
   * 
   * @returns {Stack} Returns an instance of 'stack'
   */
  public notExists(key) {
    if (typeof key !== 'string') {
      throw new Error('Kindly pass valid key for \'.notExists()\'')
    } else if (this.q.query && typeof this.q.query === 'object') {
      this.q.query[key] = {
        $exists: false,
      }
    } else {
      this.q.query = {
        [key]: {
          $exists: false,
        },
      }
    }

    return this
  }

  /**
   * @method contentType
   * @description
   * Content type to query on
   * 
   * @param {string} uid Content type uid
   * @example
   * Stack
   *  .contentType('blog')
   *  .entries()
   *  .find()
   *  .then((result) => {
   *    // returns entries filtered based on 'blog' content type
   *  })
   *  .catch((error) => {
   *    // handle query errors
   *  })
   * 
   * @returns {Stack} Returns an instance of 'stack'
   */
  public contentType(uid) {
    // create new instances, instead of re-using the old one
    const stack = new Stack(this.config, this.db)
    if (uid && typeof uid === 'string') {
      stack.q.content_type_uid = uid
      stack.collection = stack.db.collection(stack.contentStore.collectionName)

      return stack
    }
    throw new Error('Kindly pass the content type\'s uid')
  }

  /**
   * @method entry
   * @description
   * Query for a single entry
   * 
   * @param {string} uid - Entry uid to be found, if not provided,
   *  by default returns the 1st element in the content type.
   *  Useful for `singleton` content types
   * @example
   * Stack
   *  .contentType('blog')
   *  .entry()
   *  .find()
   *  .then((result) => {
   *    // returns the entry based on its 'uid', if not provided, it would return the 1st entry found in 'blog' content type
   *  })
   *  .catch((error) => {
   *    // handle query errors
   *  })
   * 
   * @returns {Stack} Returns an instance of 'stack'
   */
  public entry(uid ? ) {
    if (!(this.q.content_type_uid)) {
      throw new Error('Kindly call \'contentType()\' before \'entry()\'!')
    }
    if (uid && typeof uid === 'string') {
      this.q.uid = uid
    }
    this.internal.limit = 1
    this.internal.single = true

    return this
  }

  /**
   * @method entries
   * @description
   * Query for a set of entries on a content type
   * 
   * @example
   * Stack
   *  .contentType('blog')
   *  .entries()
   *  .find()
   *  .then((result) => {
   *    // returns entries filtered based on 'blog' content type
   *  })
   *  .catch((error) => {
   *    // handle query errors
   *  })
   * 
   * @returns {Stack} Returns an instance of 'stack'
   */
  public entries() {
    if (this.q.content_type_uid && typeof this.q.content_type_uid === 'string') {

      return this
    }
    throw new Error('Kindly call \'contentType()\' before \'entries()\'!')
  }

  /**
   * @method asset
   * @description
   * Query for a single asset
   * 
   * @param {string} uid Asset uid to be found, if not provided,
   *  by default returns the 1st element from assets.
   * @example
   * Stack
   *  .asset()
   *  .find()
   *  .then((result) => {
   *    // returns the asset based on its 'uid', if not provided, it would return the 1st asset found
   *  })
   *  .catch((error) => {
   *    // handle query errors
   *  })
   * 
   * @returns {Stack} Returns an instance of 'stack'
   */
  public asset(uid ? ) {
    const stack = new Stack(this.config, this.db)
    if (uid && typeof uid === 'string') {
      stack.q.uid = uid
    }
    stack.q.content_type_uid = '_assets'
    stack.collection = stack.db.collection(stack.contentStore.collectionName)
    stack.internal.limit = 1
    stack.internal.single = true

    return stack
  }

  /**
   * @method assets
   * @description
   * Query for a set of assets
   * 
   * @example
   * Stack
   *  .assets()
   *  .find()
   *  .then((result) => {
   *    // returns assets filtered based on 'blog' content type
   *  })
   *  .catch((error) => {
   *    // handle query errors
   *  })
   * 
   * @returns {Stack} Returns an instance of 'stack'
   */
  public assets() {
    const stack = new Stack(this.config, this.db)
    stack.q.content_type_uid = '_assets'
    stack.collection = stack.db.collection(stack.contentStore.collectionName)

    return stack
  }

  /**
   * @method schema
   * @description
   * Query for a single content type's schema
   * 
   * @param {string} uid Content type uid to be found, if not provided,
   *  by default returns the 1st element from content types
   * 
   * @example
   * Stack
   *  .schema('blog')
   *  .find()
   *  .then((result) => {
   *    // returns content 'blog' content type's schema
   *  })
   *  .catch((error) => {
   *    // handle query errors
   *  })
   * 
   * @returns {Stack} Returns an instance of 'stack'
   */
  public schema(uid ? ) {
    const stack = new Stack(this.config, this.db)
    if (uid && typeof uid === 'string') {
      stack.q.uid = uid
    }
    stack.q.content_type_uid = 'contentTypes'
    stack.collection = stack.db.collection(stack.contentStore.collectionName)
    stack.internal.limit = 1
    stack.internal.single = true

    return stack
  }

  /**
   * @method schemas
   * @description
   * Query for a set of content type schemas
   * @public
   * @example
   * Stack
   *  .schemas()
   *  .find()
   *  .then((result) => {
   *    // returns a set of content type schemas
   *  })
   *  .catch((error) => {
   *    // handle query errors
   *  })
   * 
   * @returns {Stack} Returns an instance of 'stack'
   */
  public schemas() {
    const stack = new Stack(this.config, this.db)
    stack.q.content_type_uid = 'contentTypes'
    stack.collection = stack.db.collection(stack.contentStore.collectionName)

    return stack
  }

  /**
   * Parameter - used to limit the total no of items returned/scanned
   * Defaults to 100 (internally, which is overridden)
   * 
   * @param {number} no Max count of the 'items' returned
   * 
   * @example
   * Stack
   *  .contentType('blog')
   *  .entries()
   *  .limit(20)
   *  .find()
   *  .then((result) => {
   *    // returns a maximum of 20 entries
   *    // if not provided, by default - the limit specified in config is returned
   *  })
   *  .catch((error) => {
   *    // handle query errors
   *  })
   * 
   * @returns {Stack} Returns an instance of 'stack'
   */
  public limit(no) {
    if (typeof no === 'number' && (no >= 0) && typeof this.q.content_type_uid === 'string') {
      this.internal.limit = no

      return this
    }
    throw new Error('Kindly provide a valid \'numeric\' value for \'limit()\'')
  }

  /**
   * Parameter - used to skip initial no of items scanned
   * Defaults to 0 (internally, which is overridden)
   * 
   * @param {number} no Min count of the 'items' to be scanned
   * 
   * @example
   * Stack
   *  .contentType('blog')
   *  .entries()
   *  .skip(10)
   *  .find()
   *  .then((result) => {
   *    // returnes entries, after first skipping 20 entries of 'blog' content type
   *    // if not provided, by default - the skip value provided in config is considered
   *  })
   *  .catch((error) => {
   *    // handle query errors
   *  })
   * 
   * @returns {Stack} Returns an instance of 'stack'
   */
  public skip(no) {
    if (typeof no === 'number' && (no >= 0) && typeof this.q.content_type_uid === 'string') {
      this.internal.skip = no

      return this
    }
    throw new Error('Kindly provide a valid \'numeric\' value for \'skip()\'')
  }

  /**
   * Wrapper around a raw query wrapper
   * @param {object} queryObject Query filter
   * 
   * @example
   * Stack
   *  .contentType('blog')
   *  .entries()
   *  .query({"group.heading": "Tab 1"})
   *  .find()
   *  .then((result) => {
   *    // returns entries that have - {"group.heading": "Tab 1"}
   *  })
   *  .catch((error) => {
   *    // handle query errors
   *  })
   * 
   * @returns {Stack} Returns an instance of 'stack'
   */
  public query(queryObject = {}) {
    if (this.q.query && typeof this.q.query === 'object') {
      this.q.query = merge(this.q.query, queryObject)
    } else {
      this.q.query = queryObject
    }

    return this
  }

  /**
   * Projections - returns only the fields passed here
   * 
   * @param {array} fields Array of 'fields', separated by dot ('.') notation for embedded document query
   * 
   * @example
   * Stack
   *  .contentType('blog')
   *  .entries()
   *  .only(["title", "url", "links"])
   *  .find()
   *  .then((result) => {
   *    // returns entries and projects only their - ["title", "url", "links"] properties
   *  })
   *  .catch((error) => {
   *    // handle query errors
   *  })
   * 
   * @returns {Stack} Returns an instance of 'stack'
   */
  public only(fields) {
    if (!fields || typeof fields !== 'object' || !(fields instanceof Array) || fields.length === 0) {
      throw new Error('Kindly provide valid \'field\' values for \'only()\'')
    }
    this.internal.only = this.internal.only || {}
    this.internal.only._id = 0

    fields.forEach((field) => {
      if (typeof field === 'string') {
        this.internal.only[field] = 1
      }
    })

    return this
  }

  /**
   * Projections - returns fields except the ones passed here
   * 
   * @param {array} fields Array of 'fields', separated by dot ('.') notation for embedded document query
   * @example
   * Stack
   *  .contentType('blog')
   *  .entries()
   *  .except(["title", "url", "links"])
   *  .find()
   *  .then((result) => {
   *    // returns entries and projects all of their properties, except - ["title", "url", "links"]
   *  })
   *  .catch((error) => {
   *    // handle query errors
   *  })
   * 
   * @returns {Stack} Returns an instance of 'stack'
   */
  public except(fields) {
    if (!fields || typeof fields !== 'object' || !(fields instanceof Array) || fields.length === 0) {
      throw new Error('Kindly provide valid \'field\' values for \'except()\'')
    }
    this.internal.except = this.internal.except || {}
    fields.forEach((field) => {
      if (typeof field === 'string') {
        this.internal.except[field] = 0
      }
    })

    this.internal.except = merge(this.contentStore.projections, this.internal.except)

    return this
  }

  /**
   * Raw regex to be applied on a field - wrapper
   * 
   * @param {string} field Field on which the regex is to be applied on
   * @param {pattern} pattern Regex pattern
   * @param {options} options Options to be applied while evaluating the regex
   * @example
   * Stack
   *  .contentType('blog')
   *  .entries()
   *  .regex("name", "^J")
   *  .find()
   *  .then((result) => {
   *    // returns entries who's name properties start with "J"
   *  })
   *  .catch((error) => {
   *    // handle query errors
   *  })
   * 
   * @returns {Stack} Returns an instance of 'stack'
   */
  public regex(field, pattern, options = 'i') {
    if (!(field) || !(pattern) || typeof field !== 'string' || typeof pattern !== 'string') {
      throw new Error('Kindly provide a valid field and pattern value for \'.regex()\'')
    } else if (this.q.query && typeof this.q.query === 'object') {
      this.q.query = merge(this.q.query, {
        [field]: {
          $options: options,
          $regex: pattern,
        },
      })
    } else {
      this.q.query = {
        [field]: {
          $options: options,
          $regex: pattern,
        },
      }
    }

    return this
  }

  /**
   * Match entries that match a specific tags
   * 
   * @param {array} values Array of tag values
   * @example
   * Stack
   *  .contentType('blog')
   *  .entries()
   *  .tags(["new", "fresh"])
   *  .find()
   *  .then((result) => {
   *    // returns entries filtered based on their tag fields
   *  })
   *  .catch((error) => {
   *    // handle query errors
   *  })
   * 
   * @returns {Stack} Returns an instance of 'stack'
   */
  public tags(values) {
    if (!values || typeof values !== 'object' || !(values instanceof Array) || values.length === 0) {
      throw new Error('Kindly provide valid \'field\' values for \'tags()\'')
    }
    // filter non-string keys
    remove(values, (value) => {
      return typeof value !== 'string'
    })

    if (this.q.query && typeof this.q.query === 'object') {
      this.q.query.tags = {
        $in: values,
      }
    } else {
      this.q.query = {
        tags: {
          $in: values,
        },
      }
    }

    return this
  }

  /**
   * @summary
   * Pass JS expression or a full function to the query system
   * 
   * @description
   * Use the $where operator to pass either a string containing a JavaScript expression or a full JavaScript function to the query system.
   * The $where provides greater flexibility, but requires that the database processes the JavaScript expression or function for each document in the collection.
   * Reference the document in the JavaScript expression or function using either this or obj.
   * Only apply the $where query operator to top-level documents.
   * The $where query operator will not work inside a nested document, for instance, in an $elemMatch query. 
   * Ref. - https://docs.mongodb.com/manual/reference/operator/query/where/index.html
   * @param {*} expr - Pass either a string containing a JavaScript expression or a full JavaScript function to the query system.
   * @example
   * Stack
   *  .contentType('blog')
   *  .entries()
   *  .where(function() { 
   *    return (hex_md5(this.name) === "9b53e667f30cd329dca1ec9e6a83e994")
   *  })
   *  .find()
   *  .then((result) => {
   *    // returns entries filtered based on the $where condition provided
   *  })
   *  .catch((error) => {
   *    // handle query errors
   *  })
   * 
   * @returns {Stack} Returns an instance of 'stack'
   */
  public where(expr) {
    if (!(expr)) {
      throw new Error('Kindly provide a valid field and expr/fn value for \'.where()\'')
    } else if (this.q.query && typeof this.q.query === 'object') {
      if (typeof expr === 'function') {
        expr = expr.toString()
      }
      this.q.query = merge(this.q.query, {
        $where: expr,
      })
    } else {
      if (typeof expr === 'function') {
        expr = expr.toString()
      }
      this.q.query = {
        $where: expr,
      }
    }

    return this
  }

  /**
   * @description
   * Includes 'count' key in response, which is the total count of the items being returned
   * 
   * @example
   * Stack
   *  .contentType('blog')
   *  .entries()
   *  .includeCount()
   *  .find()
   *  .then((result) => {
   *    // returns entries, along with a 'count' property, with the total count of entries being returned
   *  })
   *  .catch((error) => {
   *    // handle query errors
   *  })
   * 
   * @returns {Stack} Returns an instance of 'stack'
   */
  public includeCount() {
    this.internal.includeCount = true

    return this
  }

  /**
   * @description
   * Includes 'content_type' key in response, which is the content type schema of the entries filtered/scanned
   * @example
   * Stack
   *  .contentType('blog')
   *  .entries()
   *  .includeSchema()
   *  .find()
   *  .then((result) => {
   *    // returns entries, along with a 'content_type' property, which is 'blog' content type's schema
   *  })
   *  .catch((error) => {
   *    // handle query errors
   *  })
   * 
   * @returns {Stack} Returns an instance of 'stack'
   */
  public includeSchema() {
    this.internal.includeSchema = true

    return this
  }

  /**
   * @description
   * Includes 'content_type' key in response, which is the content type schema of the entries filtered/scanned
   * @example
   * Stack
   *  .contentType('blog')
   *  .entries()
   *  .includeContentType()
   *  .find()
   *  .then((result) => {
   *    // returns entries, along with a 'content_type' property, which is 'blog' content type's schema
   *  })
   *  .catch((error) => {
   *    // handle query errors
   *  })
   * 
   * @returns {Stack} Returns an instance of 'stack'
   */

  public includeContentType() {
    this.internal.includeSchema = true

    return this
  }

  /**
   * @description
   * Includes all references of the entries being returned.
   * Note: This is a slow method, since it iteratively queries all the references and their references, binds them and returns
   * @example
   * Stack
   *  .contentType('blog')
   *  .entries()
   *  .includeReferences()
   *  .find()
   *  .then((result) => {
   *    // returns entries, along with all their references and their nested references
   *  })
   *  .catch((error) => {
   *    // handle query errors
   *  })
   * 
   * @returns {Stack} Returns an instance of 'stack'
   */
  public includeReferences() {
    this.internal.includeReferences = true

    return this
  }

  /**
   * @method excludeReferences
   * @description
   * Excludes all references of the entries being scanned
   * Note: On calling this, assets will not be binded in the result being returned.
   * 
   * @example
   * Stack
   *  .contentType('blog')
   *  .entries()
   *  .excludeReferences()
   *  .find()
   *  .then((result) => {
   *    // returns entries, without any of its assets Or references
   *  })
   *  .catch((error) => {
   *    // handle query errors
   *  })
   * 
   * @returns {Stack} Returns an instance of 'stack'
   */
  public excludeReferences() {
    this.internal.excludeReferences = true

    return this
  }

  /**
   * @method queryReferences
   * @description
   * Wrapper, that allows querying on the entry's references.
   * Note: This is a slow method, since it scans all documents and fires the `reference` query on them. Once the references are binded, the query object passed is used for filtering
   * Use `.query()` filters to reduce the total no of documents being scanned
   * 
   * @example
   * Stack
   *  .contentType('blog')
   *  .entries()
   *  .queryReferences({"authors.name": "John Doe"})
   *  .find()
   *  .then((result) => {
   *    // returns entries, who's reference author's name equals "John Doe"
   *  })
   *  .catch((error) => {
   *    // handle query errors
   *  })
   * 
   * @returns {Stack} Returns an instance of 'stack'
   */
  public queryReferences(query) {
    if (query && typeof query === 'object') {
      this.internal.queryReferences = query

      return this
    }

    throw new Error('Kindly pass a query object for \'.queryReferences()\'')
  }

  /**
   * @method getQuery
   * @description Returns the query build thusfar
   * 
   * @example
   * const query = Stack
   *  .contentType('blog')
   *  .entries()
   *  .getQuery()
   * // exposes details of the queries formed inside the SDK
   * 
   * @returns {Stack} Returns an instance of 'stack'
   */
  public getQuery() {
    return {
      ...this.q,
    }
  }

  /**
   * @method find
   * @description
   * Queries the db using the query built/passed
   * Does all the processing, filtering, referencing after querying the DB
   * @param {object} query Optional query object, that overrides all the 
   * previously build queries
   * @public
   * @example
   * Stack
   *  .contentType('blog')
   *  .entries()
   *  .find()
   *  .then((result) => {
   *    // returns blog content type's entries
   *  })
   *  .catch((error) => {
   *    // handle query errors
   *  })
   * 
   * @returns {object} - Returns a objects, that have been processed, filtered and referenced
   */
  public find(query = {}) {
    return new Promise((resolve, reject) => {
      const queryFilters = this.preProcess(query)

      if (this.internal.sort) {
        this.collection = this.collection.find(queryFilters).sort(this.internal.sort)
      } else {
        this.collection = this.collection.find(queryFilters)
      }

      // process it in a different manner
      if (this.internal.queryReferences) {
        return this.queryOnReferences()
          .then(resolve)
          .catch(reject)
      }

      return this.collection
        .project(this.internal.projections)
        .limit(this.internal.limit)
        .skip(this.internal.skip)
        .toArray()
        .then((result) => {
          let contentType
          if (this.internal.includeSchema && this.q.content_type_uid !== 'contentTypes' && this.q.content_type_uid !==
            '_assets') {
            contentType = remove(result, {uid: this.q.content_type_uid})
            contentType = (typeof contentType === 'object' && contentType instanceof Array && contentType.length) ?
              contentType[0] : null
          }

          if (this.internal.excludeReferences || this.q.content_type_uid === 'contentTypes' || this.q.content_type_uid
            === '_assets') {
            result = this.postProcess(result, contentType)

            return resolve(result)
          } else {

            return this.includeReferencesI(result, this.q.locale, {}, undefined)
              .then(() => {
                result = this.postProcess(result, contentType)

                return resolve(result)
              })
              .catch((refError) => {
                this.cleanup()

                return reject(refError)
              })
          }
        })
        .catch((error) => {
          this.cleanup()

          return reject(error)
        })
    })
  }

  /**
   * @method count
   * @description Returns the count of the entries/assets that match the filter
   * @param {object} query Optional query filter object
   * @public
   * @example
   * Stack
   *  .contentType('blog')
   *  .entries()
   *  .count()
   *  .then((result) => {
   *    // returns entries, without any of its assets Or references
   *  })
   *  .catch((error) => {
   *    // handle query errors
   *  })
   * 
   * @returns {object} Returns count of the entries/asset's matched
   */
  public count(query?) {
    return new Promise((resolve, reject) => {
      const queryFilters = this.preProcess(query)
      this.collection = this.collection.find(queryFilters)
      // process it in a different manner
      if (this.internal.queryReferences) {
        return this.collection
        .project(this.internal.projections)
        .toArray()
        .then((result) => {
          if (result === null || result.length === 0) {
            return resolve({ count: 0})
          }
          this.internal.includeReferences = true

          return this.includeReferencesI(result, this.q.locale, {}, undefined)
            .then(() => {
              result = sift(this.internal.queryReferences, result)
              result = result.length
              this.cleanup()

              return resolve({ count: result})
            })
        })
        .catch((error) => {
          this.cleanup()

          return reject(error)
        })
      }

      return this.collection
        .project(this.internal.projections)
        .count()
        .then((result) => {
          this.cleanup()

          return resolve({ count: result })
        })
        .catch((error) => {
          this.cleanup()

          return reject(error)
        })
    })
  }

  /**
   * @method findOne
   * @description
   * Queries the db using the query built/passed. Returns a single entry/asset/content type object
   * Does all the processing, filtering, referencing after querying the DB
   * @param {object} query Optional query object, that overrides all the previously build queries
   * 
   * @example
   * Stack
   *  .contentType('blog')
   *  .entries()
   *  .findOne()
   *  .then((result) => {
   *    // returns an entry
   *  })
   *  .catch((error) => {
   *    // handle query errors
   *  })
   * 
   * @returns {object} - Returns an object, that has been processed, filtered and referenced
   */
  public findOne(query = {}) {
    return new Promise((resolve, reject) => {
      this.internal.single = true

      return this.find(query)
        .then(resolve)
        .catch(reject)
    })
  }

  private queryOnReferences() {
    return new Promise((resolve, reject) => {
      return this.collection
        // .find(query)
        .project(this.internal.projections)
        // .limit(this.internal.limit)
        // .skip(this.internal.skip)
        .toArray()
        .then((result) => {
          return this.includeReferencesI(result, this.q.locale, {}, undefined)
            .then(() => {
              result = sift(this.internal.queryReferences, result)

              if (this.internal.skip) {
                result = result.splice(this.internal.skip, this.internal.limit)
              } else if (this.internal.limit) {
                result = result.splice(0, this.internal.limit)
              }

              result = this.postProcess(result)

              return resolve(result)
            })
            .catch((refError) => {
              this.cleanup()

              return reject(refError)
            })
        })
        .catch((error) => {
          this.cleanup()

          return reject(error)
        })
    })
  }

  /**
   * @private
   * @method preProcess
   * @summary Internal method, that executes and formats the queries built/passed
   * @param {object} query Query filter/process object
   * @returns {object} Returns a query object, that has been processed to be queried in mongodb
   */
  private preProcess(query) {
    let queryFilters
    if (this.q.query && typeof this.q.query === 'object') {
      this.q.query = merge(this.q.query, query)
    } else {
      this.q.query = {}
    }

    if (this.internal.only) {
      this.internal.projections = this.internal.only
    } else {
      this.internal.projections = merge(this.contentStore.projections, this.internal.except)
    }

    if (!(this.internal.limit)) {
      this.internal.limit = this.contentStore.limit
    }

    if (!(this.internal.skip)) {
      this.internal.skip = this.contentStore.skip
    }

    if (!(this.q.locale)) {
      this.q.locale = this.config.locales[0].code
    }

    if (this.q.content_type_uid === 'contentTypes') {
      delete this.q.locale
    }

    const filters = {
      content_type_uid: this.q.content_type_uid,
      locale: this.q.locale,
      ...this.q.query,
    }

    if (this.internal.includeSchema) {
      // since, content type will take up 1 item-space
      this.internal.limit += 1
      queryFilters = {
        $or: [
          filters,
          {
            uid: this.q.content_type_uid,
          },
        ],
      }
    } else {
      queryFilters = filters
    }

    return queryFilters
  }

  /**
   * @private
   * @method cleanup
   * @summary Does GC, so memory doesn't stackup
   */
  private cleanup() {
    this.collection = null
    this.internal = null
    this.q = null
  }

  /**
   * @private
   * @method postProcess
   * @summary Internal method, that executes and formats the result, which the user and use
   * @param {object} result Result, which's to be manipulated
   * @returns {object} Returns the formatted version of the `result` object
   */
  private postProcess(result, contentType?) {
    const count = (result === null) ? 0 : result.length
    // if (this.internal.only) {
    //   result.forEach((item) => mask(item, this.internal.except))
    // }
    // result.forEach((item) => delete item._id)
    switch (this.q.content_type_uid) {
    case '_assets':
      if (this.internal.single) {
        result = {
          asset: (result === null) ? result : result[0],
        }
      } else {
        result = {
          assets: result,
        }
      }
      result.content_type_uid = 'assets'
      result.locale = this.q.locale
      break
    case 'contentTypes':
      if (this.internal.single) {
        result = {
          content_type: (result === null) ? result : result[0],
        }
      } else {
        result = {
          content_types: result,
        }
      }
      result.content_type_uid = 'content_types'
      break
    default:
      if (this.internal.single) {
        result = {
          entry: (result === null) ? result : result[0],
        }
      } else {
        result = {
          entries: result,
        }
      }
      result.content_type_uid = this.q.content_type_uid
      result.locale = this.q.locale
      break
    }

    if (this.internal.includeCount) {
      result.count = count
    }

    if (this.internal.includeSchema) {
      result.content_type = contentType
    }

    this.cleanup()

    return result
  }

  /**
   * @private
   * @method includeReferencesI
   * @summary Internal method, that iteratively calls itself and binds entries reference
   * @param {object} entry An entry or a collection of entries, who's references are to be found
   * @param {string} locale Locale, in which the reference is to be found
   * @param {object} references A map of uids tracked thusfar (used to detect cycle)
   * @param {string} parentUid Entry uid, which is the parent of the current `entry` object
   * @returns {object} Returns `entry`, that has all of its reference binded
   */
  private includeReferencesI(entry, locale, references, parentUid?) {
    const self = this

    return new Promise((resolve, reject) => {
      if (entry === null || typeof entry !== 'object') {
        return resolve()
      }

      // current entry becomes the parent
      if (entry.uid) {
        parentUid = entry.uid
      }

      const referencesFound = []

      // iterate over each key in the object
      for (const prop in entry) {
        if (entry[prop] !== null && typeof entry[prop] === 'object') {
          if (entry[prop] && entry[prop].reference_to) {
            if ((!(this.internal.includeReferences)
            && entry[prop].reference_to === '_assets') || this.internal.includeReferences) {
              if (entry[prop].values.length === 0) {
                entry[prop] = []
              } else {
                let uids = entry[prop].values
                if (typeof uids === 'string') {
                  uids = [uids]
                }
                if (entry[prop].reference_to !== '_assets') {
                  uids = filter(uids, (uid) => {
                    return !(checkCyclic(uid, references))
                  })
                }
                if (uids.length) {
                  const query = {
                    content_type_uid: entry[prop].reference_to,
                    locale,
                    uid: {
                      $in: uids,
                    },
                  }

                  referencesFound.push(new Promise((rs, rj) => {
                    return self.db.collection(this.contentStore.collectionName)
                      .find(query)
                      .project(self.config.contentStore.projections)
                      .toArray()
                      .then((result) => {
                        if (result.length === 0) {
                          entry[prop] = []

                          return rs()
                        } else if (parentUid) {
                          references[parentUid] = references[parentUid] || []
                          references[parentUid] = uniq(references[parentUid].concat(map(result, 'uid')))
                        }

                        if (typeof entry[prop].values === 'string') {
                          entry[prop] = ((result === null) || result.length === 0) ? null : result[0]
                        } else {
                          // format the references in order
                          const referenceBucket = []
                          query.uid.$in.forEach((entityUid) => {
                            const elem = find(result, (entity) => {
                              return entity.uid === entityUid
                            })
                            if (elem) {
                              referenceBucket.push(elem)
                            }
                          })
                          entry[prop] = referenceBucket
                        }

                        return self.includeReferencesI(entry[prop], locale, references, parentUid)
                          .then(rs)
                          .catch(rj)
                      })
                      .catch(rj)
                  }))
                }
              }
            }
          } else {
            referencesFound.push(self.includeReferencesI(entry[prop], locale, references, parentUid))
          }
        }
      }

      return Promise.all(referencesFound)
        .then(resolve)
        .catch(reject)
    })
  }
}
