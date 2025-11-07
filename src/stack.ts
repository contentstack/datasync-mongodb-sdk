/*!
 * Contentstack DataSync Mongodb SDK
 * Copyright (c) 2019 Contentstack LLC
 * MIT Licensed
 */

import {
  merge,
  mergeWith,
  remove,
  isArray
} from 'lodash'
import {
  Db,
  MongoClient,
} from 'mongodb'
import sift from 'sift'
import {
  config,
} from './config'
import {
  getCollectionName,
  validateConfig,
  validateURI,
} from './util'
import {
  ErrorMessages,
  WarningMessages,
} from './messages'

interface IShelf {
  path: string,
  position: string,
  uid: string,
}

interface IQuery {
  $or: Array < {
    _content_type_uid: string,
    _version?: {
      $exists: boolean,
    },
    uid: string,
    locale?: string,
  } >
}

interface ICollectionNames {
  asset: string,
  entry: string,
  schema: string,
}

/**
 * @class Stack
 * @descriptionExpose SDK query methods on Stack
 * @constructor
 * @descriptionProvides a range of connection/disconnect, filters and projections on mongodb
 * @returns {Stack} Returns an instance of `Stack`
 */
export class Stack {
  private q: any
  private readonly collectionNames: ICollectionNames
  private readonly config: any
  private readonly contentStore: any
  private readonly types: any
  private client: any
  private collection: any
  private internal: any
  private db: Db

  constructor(stackConfig, existingDB ? ) {
    this.config = merge(config, stackConfig)
    // validates config.locales property
    validateConfig(this.config)
    this.contentStore = this.config.contentStore
    this.collectionNames = this.contentStore.collection
    this.types = this.contentStore.internal.types
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
  public ascending(field) {
    if (typeof this.q.content_type_uid !== 'string' || typeof field !== 'string' || field.length === 0) {
      throw new Error(ErrorMessages.INVALID_ASCENDING_PARAMS)
    } else if (this.internal.sort && typeof this.internal.sort === 'object') {
      this.internal.sort[field] = 1
    } else {
      this.internal.sort = {
        [field]: 1,
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
  public descending(field) {
    if (typeof this.q.content_type_uid !== 'string' || typeof field !== 'string' || field.length === 0) {
      throw new Error(ErrorMessages.INVALID_DESCENDING_PARAMS)
    } else if (this.internal.sort && typeof this.internal.sort === 'object') {
      this.internal.sort[field] = -1
    } else {
      this.internal.sort = {
        [field]: -1,
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
  public async connect(overrides = {}) {
    const dbConfig = merge({}, this.config, overrides).contentStore

    const url = validateURI(dbConfig.url)
    const options = dbConfig.options
    const dbName = dbConfig.dbName
    const client = new MongoClient(url, options)
    this.client = client

    await client.connect()
    this.db = client.db(dbName)

    return this.db
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
    if (typeof code !== 'string' || code.length === 0) {
      throw new Error(ErrorMessages.INVALID_LANGUAGE_PARAMS)
    }
    this.q.locale = code

    return this
  }

  /**
   * @public
   * @method and
   * @summary Logical AND query wrapper
   * @descriptionAccepts 2 queries and returns only those documents, that satisfy both the query conditions
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
    if (typeof queries !== 'object' || !Array.isArray(queries)) {
      throw new Error(ErrorMessages.INVALID_AND_PARAMS)
    } else if (this.q.query && typeof this.q.query === 'object') {
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
   * @public
   * @method or
   * @summary Logical OR query wrapper
   * @descriptionAccepts 2 queries and returns only those documents, that satisfy either of the query conditions
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
    if (typeof queries !== 'object' || !Array.isArray(queries)) {
      throw new Error(ErrorMessages.INVALID_OR_PARAMS)
    } else if (this.q.query && typeof this.q.query === 'object') {
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
   * @public
   * @method lessThan
   * @summary Comparison $lt query wrapper
   * @description
   * Compares the field/key provided against the provided value.
   * Only documents that have lower value than the one provided are returned.
   * Check https://docs.mongodb.com/manual/reference/operator/query/lt/
   * and https://docs.mongodb.com/manual/reference/method/db.collection.find/#type-bracketing for more info
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
      throw new Error(ErrorMessages.INVALID_LESSTHAN_PARAMS)
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
   * @public
   * @method lessThanOrEqualTo
   * @summary Comparison $lte query wrapper
   * @description
   * Compares the field/key provided against the provided value.
   * Only documents that have lower or equal value than the one provided are returned.
   * Check https://docs.mongodb.com/manual/reference/operator/query/lte/
   * and https://docs.mongodb.com/manual/reference/method/db.collection.find/#type-bracketing for more info
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
      throw new Error(ErrorMessages.INVALID_LESSTHAN_OR_EQUAL_PARAMS)
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
   * @public
   * @method greaterThan
   * @summary Comparison $gt query wrapper
   * @description
   * Compares the field/key provided against the provided value.
   * Only documents that have greater value than the one provided are returned.
   * Check {@link https://docs.mongodb.com/manual/reference/operator/query/gt/ }
   * and https://docs.mongodb.com/manual/reference/method/db.collection.find/#type-bracketing for more info
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
      throw new Error(ErrorMessages.INVALID_GREATERTHAN_PARAMS)
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
   * @public
   * @method greaterThanOrEqualTo
   * @summary Comparison $gte query wrapper
   * @description
   * Compares the field/key provided against the provided value.
   * Only documents that have greater than or equal value than the one provided are returned.
   * Check https://docs.mongodb.com/manual/reference/operator/query/gte/ and
   * https://docs.mongodb.com/manual/reference/method/db.collection.find/#type-bracketing for more info
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
      throw new Error(ErrorMessages.INVALID_GREATERTHAN_OR_EQUAL_PARAMS)
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
   * @public
   * @method notEqualTo
   * @summary Comparison $ne query wrapper
   * @description
   * Compares the field/key provided against the provided value.
   * Only documents that have value not equals than the one provided are returned.
   *
   * Check mongodb query here: {@link https://docs.mongodb.com/manual/reference/operator/query/ne/}.
   *
   * Res: {@link https://docs.mongodb.com/manual/reference/method/db.collection.find/#type-bracketing}.
   *
   * Comparison ordering
   * {@link https://docs.mongodb.com/manual/reference/bson-type-comparison-order/#bson-types-comparison-order}
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
      throw new Error(ErrorMessages.INVALID_NOTEQUAL_PARAMS)
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
   * @public
   * @method containedIn
   * @summary Comparison $in query wrapper
   * @description
   * Compares the field/key provided against the provided value.
   * Only documents that have value contained in the field/key provided are returned.
   *
   * Check mongodb query here: {@link https://docs.mongodb.com/manual/reference/operator/query/in/}.
   *
   * Res: {@link https://docs.mongodb.com/manual/reference/method/db.collection.find/#type-bracketing}.
   *
   * Comparison ordering
   * {@link https://docs.mongodb.com/manual/reference/bson-type-comparison-order/#bson-types-comparison-order}
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
      throw new Error(ErrorMessages.INVALID_CONTAINED_IN_PARAMS)
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
   * @public
   * @method notContainedIn
   * @summary Comparison $nin query wrapper
   * @description
   * Compares the field/key provided against the provided value.
   * Only documents that have value not contained in the field/key provided are returned.
   *
   * Check mongodb query here: {@link https://docs.mongodb.com/manual/reference/operator/query/nin/}.
   *
   * Res: {@link https://docs.mongodb.com/manual/reference/method/db.collection.find/#type-bracketing}.
   *
   * Comparison ordering
   * {@link https://docs.mongodb.com/manual/reference/bson-type-comparison-order/#bson-types-comparison-order}
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
      throw new Error(ErrorMessages.INVALID_NOT_CONTAINED_IN_PARAMS)
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
   * @public
   * @method exists
   * @summary Element $exists query wrapper, checks if a field exists
   * @description
   * Compares the field / key provided against the provided value.Only documents that have the field /
   *  key specified are returned.
   *
   * Check mongodb query here: {@link https://docs.mongodb.com/manual/reference/operator/query/exists/}.
   *
   * Res: {@link https://docs.mongodb.com/manual/reference/method/db.collection.find/#type-bracketing}.
   *
   * Comparison ordering{
   * @link https: //docs.mongodb.com/manual/reference/bson-type-comparison-order/#bson-types-comparison-order}
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
      throw new Error(ErrorMessages.INVALID_EXISTS_PARAMS)
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
   * @public
   * @method notExists
   * @summary
   * Property $exists query wrapper, checks if a field does not exists
   * @description
   * Compares the field/key provided against the provided value. Only documents that do not have the key are returned.
   *
   * Check mongodb query here: {@link https://docs.mongodb.com/manual/reference/operator/query/exists/}.
   *
   * Res: {@link https://docs.mongodb.com/manual/reference/method/db.collection.find/#type-bracketing}.
   *
   * Comparison ordering{
   * @link https: //docs.mongodb.com/manual/reference/bson-type-comparison-order/#bson-types-comparison-order}
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
      throw new Error(ErrorMessages.INVALID_NOT_EXISTS_PARAMS)
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
   * @public
   * @method contentType
   * @summary Content type to query on
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

      return stack
    }
    throw new Error(ErrorMessages.MISSING_CONTENT_TYPE_UID)
  }

  /**
   * @public
   * @method entry
   * @summary Query for a single entry
   * @param {string} uid Entry uid to be found, if not provided,
   *  by default returns the 1st element in the content type.
   *  Useful for `singleton` content types
   * @example
   * Stack
   *  .contentType('blog')
   *  .entry()
   *  .find()
   *  .then((result) => {
   *    // returns the entry based on its 'uid',
   *    // if not provided, it would return the 1st entry found in 'blog' content type
   *  })
   *  .catch((error) => {
   *    // handle query errors
   *  })
   *
   * @returns {Stack} Returns an instance of 'stack'
   */
  public entry(uid ? ) {
    if (!(this.q.content_type_uid)) {
      throw new Error(ErrorMessages.MISSING_CONTENT_TYPE_FOR_ENTRY)
    }
    if (uid && typeof uid === 'string') {
      this.q.query = this.q.query || {}
      this.q.query.uid = uid
    }
    this.internal.limit = 1
    this.internal.single = true

    return this
  }

  /**
   * @public
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
    throw new Error(ErrorMessages.MISSING_CONTENT_TYPE_FOR_ENTRIES)
  }

  /**
   * @public
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
      stack.q.query = stack.q.query || {}
      stack.q.query.uid = uid
    }
    stack.q.content_type_uid = this.types.assets
    // stack.collection = stack.db.collection(stack.contentStore.collectionName)
    stack.internal.limit = 1
    stack.internal.single = true

    return stack
  }

  /**
   * @public
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
    stack.q.content_type_uid = this.types.assets
    // stack.collection = stack.db.collection(stack.contentStore.collectionName)

    return stack
  }

  /**
   * @public
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
      stack.q.query = stack.q.query || {}
      stack.q.query.uid = uid
    }
    stack.q.content_type_uid = this.types.content_types
    // stack.collection = stack.db.collection(stack.contentStore.collectionName)
    stack.internal.limit = 1
    stack.internal.single = true

    return stack
  }

  /**
   * @public
   * @method schemas
   * @description
   * Query for a set of content type schemas
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
    stack.q.content_type_uid = this.types.content_types
    // stack.collection = stack.db.collection(stack.contentStore.collectionName)

    return stack
  }

  /**
   * @public
   * @method contentTypes
   * @description
   * Query for a set of content type schemas
   * @example
   * Stack
   *  .contentTypes()
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
  public contentTypes() {
    const stack = new Stack(this.config, this.db)
    stack.q.content_type_uid = this.types.content_types
    // stack.collection = stack.db.collection(stack.contentStore.collectionName)

    return stack
  }

  /**
   * @public
   * @method limit
   * @description
   * Parameter - used to limit the total no of items returned/scanned
   * Defaults to 100 (internally, which is overridden)
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
    throw new Error(ErrorMessages.INVALID_LIMIT_VALUE)
  }

  /**
   * @public
   * @method skip
   * @description
   * Parameter - used to skip initial no of items scanned
   * Defaults to 0 (internally, which is overridden)
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
    throw new Error(ErrorMessages.INVALID_SKIP_VALUE)
  }

  /**
   * @public
   * @method query
   * @description
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
   * @public
   * @method only
   * @description
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
      throw new Error(ErrorMessages.INVALID_ONLY_PARAMS)
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
   * @public
   * @method except
   * @description
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
      throw new Error(ErrorMessages.INVALID_EXCEPT_PARAMS)
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
   * @public
   * @method regex
   * @description
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
      throw new Error(ErrorMessages.INVALID_REGEX_PARAMS)
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
   * @public
   * @method tags
   * @summary Match entries that match a specific tags
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
    if (!values || typeof values !== 'object' || !(values instanceof Array)) {
      throw new Error(ErrorMessages.INVALID_TAGS_PARAMS)
    }
    // filter non-string keys
    remove(values, (value) => {
      return typeof value !== 'string'
    })

    this.q.query = this.q.query || {}
    if (values.length === 0) {
      this.q.query.tags = {
        $size: 0,
      }
    } else {
      this.q.query.tags = {
        $in: values,
      }
    }

    return this
  }

  /**
   * @public
   * @method where
   * @summary Pass JS expression or a full function to the query system
   * @description
   * Use the $where operator to pass either a string containing a JavaScript expression or a full JavaScript
   * function to the query system.
   * The $where provides greater flexibility, but requires that the database processes the JavaScript expression or
   * function for each document in the collection.
   * Reference the document in the JavaScript expression or function using either this or obj.
   * Only apply the $where query operator to top-level documents.
   * The $where query operator will not work inside a nested document, for instance, in an $elemMatch query.
   * Ref. - https://docs.mongodb.com/manual/reference/operator/query/where/index.html
   * @param { * } expr Pass either a string containing a JavaScript expression or a full JavaScript
   * function to the query system.
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
      throw new Error(ErrorMessages.INVALID_WHERE_PARAMS)
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
   * @public
   * @method includeCount
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
   * @public
   * @method includeContentType
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
   * @public
   * @method excludeReferences
   * @description
   * Excludes all references of the entries being scanned.
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
   * @public
   * @method queryReferences
   * @description
   * Wrapper, that allows querying on the entry's references.
   * Note: This is a slow method, since it scans all documents and fires the `reference`
   * query on them.Once the references are binded, the query object passed is used
   * for filtering
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

    throw new Error(ErrorMessages.INVALID_QUERY_REFERENCES_PARAMS)
  }

  /**
   * @public
   * @method getQuery
   * @description
   * Returns the query build thusfar
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
   * @public
   * @method includeReferences
   * @description
   * This method would return all the references of your queried entries (until depth 2)
   * Note: If you wish to increase the depth of the references fetched, call pass a numeric parameter
   * @example
   * Stack
   *  .contentType('blog')
   *  .entries()
   *  .includeReferences(3)
   * @returns {Stack} Returns 'this' instance (of Stack)
   */
  public includeReferences(depth?: number) {
    console.warn(WarningMessages.SLOW_INCLUDE_REFERENCES)
    if (typeof depth === 'number') {
      this.q.referenceDepth = depth
    }
    this.internal.includeAllReferences = true

    return this
  }

  /**
   * @public
   * @method include
   * @description
   * Pass in reference field uids, that you want included in your result.
   * If you want all the references, use .includeReferences()
   * @example
   * Stack.contentType('blog')
   *  .entries()
   *  .include(['related_blogs', 'authors.blogs']) // here related_blogs and authors.blogs are reference field uids
   * @param {object} fields An array of reference field uids
   * @returns {Stack} Returns 'this' instance (of Stack)
   */
  public include(fields) {
    if (fields.length === 0) {
      throw new Error(ErrorMessages.INVALID_INCLUDE_PARAMS)
    } else if (typeof fields === 'string') {
      this.internal.includeSpecificReferences = [fields]
    } else {
      this.internal.includeSpecificReferences = fields
    }

    return this
  }

  /**
   * @public
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
    return new Promise(async (resolve, reject) => {
      const queryFilters = this.preProcess(query)

      if (this.internal.sort) {
        this.collection = this.collection
          .find(queryFilters)
          .sort(this.internal.sort)
      } else {
        this.collection = this.collection
          .find(queryFilters)
      }

      if (this.internal.queryReferences) {
        this.collection = this.collection
          .project(this.internal.projections)
          .toArray()
      } else {
        this.collection = this.collection
          .project(this.internal.projections)
          .limit(this.internal.limit)
          .skip(this.internal.skip)
          .toArray()
      }

      return this.collection
        .then(async (result) => {
          // Ignore references include, for empty list, exclude call, content type & assets
          if (result.length === 0 || this.internal.excludeReferences || this.q.content_type_uid === this
            .types.content_types || this.q.content_type_uid
            === this.types.assets || (this.internal.onlyCount && !this.internal.queryReferences)) {
            // Do nothing
          } else if (this.internal.includeSpecificReferences) {
            await this.includeSpecificReferences(result, this.q.content_type_uid, this.q.locale, this
              .internal.includeSpecificReferences)
          } else if (this.internal.includeAllReferences) {
            await this.bindReferences(result, this.q.content_type_uid, this.q.locale)
          } else {
            await this.includeAssetsOnly(result, this.q.content_type_uid, this.q.locale)
          }
          if (this.internal.queryReferences) {
            result = result.filter(sift(this.internal.queryReferences))
            if (this.internal.skip) {
              result = result.splice(this.internal.skip, this.internal.limit)
            } else if (this.internal.limit) {
              result = result.splice(0, this.internal.limit)
            }
          }
          result = await this.postProcess(result)

          return resolve(result)
        })
        .catch((error) => {
          this.cleanup()

          return reject(error)
        })
    })
  }

  /**
   * @public
   * @method count
   * @descriptionReturns the count of the entries/assets that match the filter
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
  public async count(query ? ) {
    this.internal.onlyCount = true

    return this.find(query)
  }

  /**
   * @public
   * @method findOne
   * @deprecated - Use .fetch() instead
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
   *
   * @returns {object} - Returns an object, that has been processed, filtered and referenced
   */
  public findOne(query = {}) {
    this.internal.single = true

    return this.find(query)
  }

  /**
   * @public
   * @method fetch
   * @description
   * Queries the db using the query built/passed. Returns a single entry/asset/content type object
   * Does all the processing, filtering, referencing after querying the DB
   * @param {object} query Optional query object, that overrides all the previously build queries
   *
   * @example
   * Stack
   *  .contentType('blog')
   *  .entries()
   *  .fetch()
   *
   * @returns {object} - Returns an object, that has been processed, filtered and referenced
   */
  public fetch(query = {}) {
    this.internal.single = true

    return this.find(query)
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

    // tslint:disable-next-line: max-line-length
    this.q.referenceDepth = (typeof this.q.referenceDepth === 'number') ? this.q.referenceDepth : this.contentStore.referenceDepth

    if (this.internal.only) {
      this.internal.projections = this.internal.only
    } else {
      this.internal.projections = merge(this.contentStore.projections, this.internal.except)
    }

    // set default limit, if .limit() hasn't been called
    if (!(this.internal.limit)) {
      this.internal.limit = this.contentStore.limit
    }

    // set default skip, if .skip() hasn't been called
    if (!(this.internal.skip)) {
      this.internal.skip = this.contentStore.skip
    }

    // set default locale, if no locale has been passed
    if (!(this.q.locale)) {
      this.q.locale = this.contentStore.locale
    }

    // by default, sort by latest content
    if (!this.internal.sort) {
      this.internal.sort = {
        updated_at: -1,
      }
    }

    const filters = {
      _content_type_uid: this.q.content_type_uid,
      locale: this.q.locale,
      ...this.q.query,
    }

    if (this.q.content_type_uid === this.types.assets) {
      // allow querying only on published assets..!
      queryFilters = {
        $and: [
          filters,
          {
            _version: {
              $exists: true,
            },
          },
        ],
      }
    } else {
      queryFilters = filters
    }

    this.collection = this.db.collection(getCollectionName({
      content_type_uid: this.q.content_type_uid,
      locale: this.q.locale,
    }, this.collectionNames))

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
  private async postProcess(result) {
    const count = (result === null) ? 0 : result.length
    const output: any = {
      locale: this.q.locale,
    }
    if (this.internal.onlyCount) {
      output.content_type_uid = (this.q.content_type_uid === this.types.assets) ? 'assets' : ((this.q.content_type_uid
        === this.types.content_types) ? 'content_types' : this.q.content_type_uid)
      output.count = count

      return output
    }

    switch (this.q.content_type_uid) {
    case this.types.assets:
      if (this.internal.single) {
        output.asset = (result === null) ? result : result[0]
      } else {
        output.assets = result
      }
      output.content_type_uid = 'assets'
      break
    case this.types.content_types:
      if (this.internal.single) {
        output.content_type = (result === null) ? result : result[0]
      } else {
        output.content_types = result
      }
      output.content_type_uid = 'content_types'
      break
    default:
      if (this.internal.single) {
        output.entry = (result === null) ? result : result[0]
      } else {
        output.entries = result
      }
      output.content_type_uid = this.q.content_type_uid
      break
    }

    if (this.internal.includeCount) {
      output.count = await this.db.collection(getCollectionName({
        content_type_uid: this.q.content_type_uid,
        locale: this.q.locale,
      }, this.collectionNames))
      .count({
        _content_type_uid: this.q.content_type_uid,
      })
    }

    if (this.internal.includeSchema) {
      output.content_type = await this.db.collection(getCollectionName({
          content_type_uid: this.types.content_types,
          locale: this.q.locale,
        }, this.collectionNames))
        .findOne({
          uid: this.q.content_type_uid,
        }, {
          projection: {
            _assets: 0,
            _content_type_uid: 0,
            _id: 0,
            _references: 0,
          }
        })
    }

    this.cleanup()

    return output
  }

  private async includeAssetsOnly(entries: any[], contentTypeUid: string, locale: string) {
    const schema = await this.db
      .collection(getCollectionName({
        content_type_uid: this.types.content_types,
        locale,
      }, this.collectionNames))
      .findOne({
        _content_type_uid: this.types.content_types,
        uid: contentTypeUid,
      }, {
        projection: {
          _assets: 1,
          _id: 0,
        }
      })

    if (schema === null || schema[this.types.assets] !== 'object') {
      return
    }

    const paths = Object.keys(schema[this.types.assets])
    const shelf = []
    const queryBucket = {
      $or: [],
    }

    for (let i = 0, j = paths.length; i < j; i++) {
      this.fetchPathDetails(entries, locale, paths[i].split('.'), queryBucket, shelf, true, entries, 0)
    }

    if (shelf.length === 0) {
      return
    }

    const assets = await this.db.collection(getCollectionName({
        content_type_uid: this.types.assets,
        locale,
      }, this.collectionNames))
      .find(queryBucket)
      .project({
        _content_type_uid: 0,
        _id: 0,
      })
      .toArray()

    for (let l = 0, m = shelf.length; l < m; l++) {
      for (let n = 0, o = assets.length; n < o; n++) {
        if (shelf[l].uid === assets[n].uid) {
          shelf[l].path[shelf[l].position] = assets[n]
          break
        }
      }
    }

    return
  }

  /**
   * @summary
   * Internal method, that iteratively calls itself and binds entries reference
   * @param {Object} entry - An entry or a collection of entries, who's references are to be found
   * @param {String} contentTypeUid - Content type uid
   * @param {String} locale - Locale, in which the reference is to be found
   * @param {Object} include - Array of field paths, to be included
   * @returns {Object} - Returns `entries`, that has all of its reference binded
   */
  private async includeSpecificReferences(entries: any[], contentTypeUid: string, locale: string, include: string[]) {
    const ctQuery = {
      _content_type_uid: this.types.content_types,
      uid: contentTypeUid,
    }

    const {
      paths, // ref. fields in the current content types
      pendingPath, // left over of *paths*
      schemaList, // list of content type uids, the current content types refer to
    } = await this.getReferencePath(ctQuery, locale, include)

    const queries = {
      $or: [],
    } // reference field paths
    const shelf = [] // a mapper object, that holds pointer to the original element
    // iterate over each path in the entries and fetch the references
    // while fetching, keep track of their location
    for (let i = 0, j = paths.length; i < j; i++) {
      this.fetchPathDetails(entries, locale, paths[i].split('.'), queries, shelf, true, entries, 0)
    }

    // even after traversing, if no references were found, simply return the entries found thusfar
    if (shelf.length === 0) {
      return entries
    }
    // else, self-recursively iterate and fetch references
    // Note: Shelf is the one holding `pointers` to the actual entry
    // Once the pointer has been used, for GC, point the object to null

    return this.includeReferenceIteration(queries, schemaList, locale, pendingPath, shelf)
  }

  private fetchPathDetails(data: any = {}, locale, pathArr, queryBucket: IQuery, shelf: any = [],
                            assetsOnly = false, parent: any = {}, pos, counter = 0) {
    if (counter === (pathArr.length)) {
      queryBucket = this.sanitizeQueryBucket(queryBucket)    
      if (data && typeof data === 'object') {
        if (data instanceof Array && data.length) {
          data.forEach((elem, idx) => {
            if (typeof elem === 'string') {
              queryBucket.$or.push({
                _content_type_uid: this.types.assets,
                _version: { $exists: true},
                locale,
                uid: elem,
              })

              shelf.push({
                path: data,
                position: idx,
                uid: elem,
              })
            } else if (elem && typeof elem === 'object' && elem.hasOwnProperty('_content_type_uid')) {
              queryBucket.$or.push({
                _content_type_uid: elem._content_type_uid,
                locale,
                uid: elem.uid,
              })

              shelf.push({
                path: data,
                position: idx,
                uid: elem.uid,
              })
            }
          })
        } else if (typeof data === 'object') {
          if (data.hasOwnProperty('_content_type_uid')) {
            queryBucket.$or.push({
              _content_type_uid: data._content_type_uid,
              locale,
              uid: data.uid,
            })

            shelf.push({
              path: parent,
              position: pos,
              uid: data.uid,
            })
          }
        }
      } else if (typeof data === 'string') {
        queryBucket.$or.push({
          _content_type_uid: this.types.assets,
          _version: { $exists: true},
          locale,
          uid: data,
        })

        shelf.push({
          path: parent,
          position: pos,
          uid: data,
        })
      }
    } else {
      const currentField = pathArr[counter]
      counter++
      if (data instanceof Array) {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < data.length; i++) {
          if (data[i][currentField]) {
            this.fetchPathDetails(data[i][currentField], locale, pathArr, this.sanitizeQueryBucket(queryBucket)  , shelf, assetsOnly, data[i],
              currentField, counter)
          }
        }
      } else {
        if (data[currentField]) {
          this.fetchPathDetails(data[currentField], locale, pathArr, this.sanitizeQueryBucket(queryBucket), shelf, assetsOnly, data,
            currentField, counter)
        }
      }
    }

    // since we've reached last of the paths, return!
    return
  }

  private async bindLeftoverAssets(queries: IQuery, locale: string, pointerList: IShelf[]) {
    // const contents = await readFile(getAssetsPath(locale) + '.json')
    const queriesSanitize = this.sanitizeQueryBucket(queries)
    const filteredAssets = await this.db.collection(getCollectionName({
      content_type_uid: this.types.assets,
      locale,
    }, this.collectionNames))
    .find(queriesSanitize)
    .project({
      _content_type_uid: 0,
      _id: 0,
    })
    .toArray()

    for (let l = 0, m = pointerList.length; l < m; l++) {
      for (let n = 0, o = filteredAssets.length; n < o; n++) {
        if (pointerList[l].uid === filteredAssets[n].uid) {
          pointerList[l].path[pointerList[l].position] = filteredAssets[n]
          break
        }
      }
    }

    return
  }

  private async includeReferenceIteration(eQuery: any, ctQuery: any, locale: string, include: string[], oldShelf:
    IShelf[]) {
    if (oldShelf.length === 0) {
      return
    } else if (ctQuery.$or.length === 0 && eQuery.$or.length > 0) {
      await this.bindLeftoverAssets(eQuery, locale, oldShelf)

      return
    }

    const {
      paths,
      pendingPath,
      schemaList,
    } = await this.getReferencePath(ctQuery, locale, include)

    const {
      result,
      queries,
      shelf,
    } = await this.fetchEntries(eQuery, locale, paths, include)
    // GC to avoid mem leaks!
    eQuery = null

    for (let i = 0, j = oldShelf.length; i < j; i++) {
      const element: IShelf = oldShelf[i]
      let flag = true
      for (let k = 0, l = result.length; k < l; k++) {
        if (result[k].uid === element.uid) {
          element.path[element.position] = result[k]
          flag = false
          break
        }
      }

      if (flag) {
        for (let e = 0, f = oldShelf[i].path.length; e < f; e++) {
          // tslint:disable-next-line: max-line-length
          if (oldShelf[i].path[e].hasOwnProperty('_content_type_uid') && Object.keys(oldShelf[i].path[e]).length === 2) {
            (oldShelf[i].path as any).splice(e, 1)
            break
          }
        }
      }
    }

    // GC to avoid mem leaks!
    oldShelf = null

    // Iterative loops, that traverses paths and binds them onto entries
    await this.includeReferenceIteration(queries, schemaList, locale, pendingPath, shelf)

    return
  }

  private async getReferencePath(query, locale, currentInclude) {
    if (!this.sanityQueryAny(query)) {
      throw new Error(ErrorMessages.INVALID_QUERY)
    }
    const querySanitize = this.sanitizeQueryBucket(query)
    const schemas = await this.db.collection(getCollectionName({
        content_type_uid: this.types.content_types,
        locale,
      }, this.collectionNames))
      .find(querySanitize)
      .project({
        _assets: 1,
        _id: 0,
        _references: 1,
      })
      .toArray()

    const pendingPath = []
    const schemasReferred = []
    const paths = []
    const schemaList = {
      $or: [],
    }

    if (schemas.length === 0) {
      return {
        paths,
        pendingPath,
        schemaList,
      }
    }

    let entryReferences = {}

    schemas.forEach((schema) => {
      // Entry references
      entryReferences = mergeWith(entryReferences, schema[this.types.references], (existingReferences, newReferences) => {
        if (isArray(existingReferences)) { 
          return Array.from(new Set(existingReferences.concat(newReferences))); 
        }
        return existingReferences;
      });

      for (const path in schema[this.types.assets]) {
        paths.push(path)
      }
    })

    for (let i = 0, j = currentInclude.length; i < j; i++) {
      const includePath = currentInclude[i]
      // tslint:disable-next-line: forin
      for (const path in entryReferences) {
        const subStr = includePath.slice(0, path.length)
        if (subStr === path) {
          let subPath
          // Its the complete path!! Hurrah!
          if (path.length !== includePath.length) {
            subPath = subStr
            pendingPath.push(includePath.slice(path.length + 1))
          } else {
            subPath = includePath
          }

          if (typeof entryReferences[path] === 'string') {
            schemasReferred.push({
              _content_type_uid: this.types.content_types,
              uid: entryReferences[path],
            })
          } else if (entryReferences[path].length) {
            entryReferences[path].forEach((contentTypeUid) => {
              schemasReferred.push({
                _content_type_uid: this.types.content_types,
                uid: contentTypeUid,
              })
            })
          }

          paths.push(subPath)
          break
        }
      }
    }

    schemaList.$or = schemasReferred

    return {
      // path, that's possible in the current schema
      paths,
      // paths, that's yet to be traversed
      pendingPath,
      // schemas, to be loaded!
      schemaList,
    }
  }

  private async fetchEntries(query: IQuery, locale: string, paths: string[], include: string[], includeAll:
    boolean = false) {
    if (!this.sanitizeIQuery(query)) {
      throw new Error(ErrorMessages.INVALID_QUERIES)
    }
    const sanitizeQuery = this.sanitizeQueryBucket(query)
    const result = await this.db.collection(getCollectionName({
        content_type_uid: 'entries',
        locale,
      }, this.collectionNames))
      .find(sanitizeQuery)
      .project({
        _content_type_uid: 0,
        _id: 0,
        _synced_at: 0,
        event_at: 0,
      })
      .toArray()

    const queries = {
      $or: [],
    }
    const shelf = []

    if (result.length === 0) {
      return {
        queries,
        result,
        shelf,
      }
    }

    if (include.length || includeAll) {
      paths.forEach((path) => {
        this.fetchPathDetails(result, locale, path.split('.'), queries, shelf, false, result, 0)
      })
    } else {
      // if there are no includes, only fetch assets)
      paths.forEach((path) => {
        this.fetchPathDetails(result, locale, path.split('.'), queries, shelf, true, result, 0)
      })
    }

    return {
      queries,
      result,
      shelf,
    }
  }

  private async bindReferences(entries: any[], contentTypeUid: string, locale: string) {
    const ctQuery = {
      $or: [{
        _content_type_uid: this.types.content_types,
        uid: contentTypeUid,
      }],
    }

    const {
      paths, // ref. fields in the current content types
      ctQueries, // list of content type uids, the current content types refer to
    } = await this.getAllReferencePaths(ctQuery, locale)

    const queries = {
      $or: [],
    } // reference field paths
    const objectPointerList = [] // a mapper object, that holds pointer to the original element

    // iterate over each path in the entries and fetch the references
    // while fetching, keep track of their location
    for (let i = 0, j = paths.length; i < j; i++) {
      this.fetchPathDetails(entries, locale, paths[i].split('.'), this.sanitizeQueryBucket(queries), objectPointerList, true, entries, 0)
    }

    // even after traversing, if no references were found, simply return the entries found thusfar
    if (objectPointerList.length === 0) {
      return entries
    }
    // else, self-recursively iterate and fetch references
    // Note: Shelf is the one holding `pointers` to the actual entry
    // Once the pointer has been used, for GC, point the object to null

    return this.includeAllReferencesIteration(queries, ctQueries, locale, objectPointerList)
  }

  private async includeAllReferencesIteration(oldEntryQueries: IQuery, oldCtQueries: IQuery, locale:
    string,                                   oldObjectPointerList: IShelf[], depth = 0) {
    if (depth > this.q.referenceDepth || oldObjectPointerList.length === 0) {
      return
    } else if (oldCtQueries.$or.length === 0 && oldObjectPointerList.length > 0 && oldEntryQueries.$or.length > 0) {
      await this.bindLeftoverAssets(oldEntryQueries, locale, oldObjectPointerList)

      return
    }

    const {
      ctQueries,
      paths,
    } = await this.getAllReferencePaths(oldCtQueries, locale)
    // GC to aviod mem leaks
    oldCtQueries = null
    const {
      result,
      queries,
      shelf,
    } = await this.fetchEntries(oldEntryQueries, locale, paths, [], true)
    // GC to avoid mem leaks!
    oldEntryQueries = null

    for (let i = 0, j = oldObjectPointerList.length; i < j; i++) {
      const element: IShelf = oldObjectPointerList[i]
      let flag = true
      for (let k = 0, l = result.length; k < l; k++) {
        if (result[k].uid === element.uid) {
          element.path[element.position] = result[k]
          flag = false
          break
        }
      }

      if (flag) {
        for (let e = 0, f = oldObjectPointerList[i].path.length; e < f; e++) {
          // tslint:disable-next-line: max-line-length
          if (oldObjectPointerList[i].path[e].hasOwnProperty('_content_type_uid') && Object.keys(oldObjectPointerList[i].path[e]).length === 2) {
            (oldObjectPointerList[i].path as any).splice(e, 1)
            break
          }
        }
      }
    }

    // GC to avoid mem leaks!
    oldObjectPointerList = null

    ++depth
    // Iterative loops, that traverses paths and binds them onto entries
    await this.includeAllReferencesIteration(queries, ctQueries, locale, shelf, depth)

    return
  }

  private async getAllReferencePaths(contentTypeQueries: IQuery, locale: string) {
    const contents: any[] = await this.db
      .collection(getCollectionName({
          content_type_uid: this.types.content_types,
          locale,
        },
        this.collectionNames,
      ))
      .find(contentTypeQueries)
      .project({
        _assets: 1,
        _references: 1,
      })
      .toArray()
    const ctQueries: IQuery = {
      $or: [],
    }
    let paths: string[] = []

    for (let i = 0, j = contents.length; i < j; i++) {
      let assetFieldPaths: string[]
      let entryReferencePaths: string[]
      if (contents[i].hasOwnProperty(this.types.assets)) {
        assetFieldPaths = Object.keys(contents[i][this.types.assets])
        paths = paths.concat(assetFieldPaths)
      }
      if (contents[i].hasOwnProperty('_references')) {
        entryReferencePaths = Object.keys(contents[i][this.types.references])
        paths = paths.concat(entryReferencePaths)

        for (let k = 0, l = entryReferencePaths.length; k < l; k++) {
          if (typeof contents[i][this.types.references][entryReferencePaths[k]] === 'string') {
            ctQueries.$or.push({
              _content_type_uid: this.types.content_types,
              // this would probably make it slow in FS, avoid this there?
              // locale,
              uid: contents[i][this.types.references][entryReferencePaths[k]],
            })
          } else if (contents[i][this.types.references][entryReferencePaths[k]].length) {
            contents[i][this.types.references][entryReferencePaths[k]].forEach((uid) => {
              ctQueries.$or.push({
                _content_type_uid: this.types.content_types,
                // avoiding locale here, not sure if its required
                // locale,
                uid,
              })
            })
          }
        }
      }
    }

    return {
      ctQueries,
      paths,
    }
  }

  private sanitizeIQuery(query: IQuery): boolean {
    const allowedKeys = {
      _content_type_uid: 'string',
      uid: 'string',
      _version: {
        $exists: 'boolean'
      },
      locale: 'string'
    };

    const validateObject = (obj: any, schema: any): boolean => {
      for (const key in obj) {
        if (!schema.hasOwnProperty(key)) {
          return false;
        }
        if (typeof schema[key] === 'object') {
          if (!validateObject(obj[key], schema[key])) {
            return false;
          }
        } else if (typeof obj[key] !== schema[key]) {
          return false;
        }
      }
      return true;
    };
    if (!query || typeof query !== 'object' || Array.isArray(query)) {
      return false;
    }
    if (!query.$or || !Array.isArray(query.$or)) {
      return false;
    }
    for (const item of query.$or) {
      if (!validateObject(item, allowedKeys)) {
        return false;
      }
    }
    return true;
  }
  private sanityQueryAny(query: any): boolean {
    if (!query || typeof query !== 'object' || Array.isArray(query)) {
      return false;
    }
    return true;
  }

  private sanitizeQueryBucket(queryBucket: any): any {
    if (!queryBucket || typeof queryBucket !== 'object') {
      return { $or: [{ _id: { $exists: true } }] };
    }
    const sanitized = { $or: [] };
    if (!Array.isArray(queryBucket.$or)) {
      return { $or: [{ _id: { $exists: true } }] };
    }
    for (const item of queryBucket.$or) {
      if (!item || typeof item !== 'object') {
        continue;
      }
      
      const safeItem: any = {};
      if (typeof item._content_type_uid === 'string') {
        safeItem._content_type_uid = item._content_type_uid;
      }
      
      if (typeof item.uid === 'string') {
        safeItem.uid = item.uid;
      }
      
      if (typeof item.locale === 'string') {
        safeItem.locale = item.locale;
      }
      
      if (item._version && typeof item._version === 'object' && 
          typeof item._version.$exists === 'boolean') {
        safeItem._version = { $exists: item._version.$exists };
      }
      if (safeItem._content_type_uid && safeItem.uid) {
        sanitized.$or.push(safeItem);
      }
    }
    if (sanitized.$or.length === 0) {
      return { $or: [{ _id: { $exists: true } }] };
    }
    
    return sanitized;
  }
}
