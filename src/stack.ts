/*!
 * Contentstack Sync Mongodb SDK
 * Copyright (c) 2019 Contentstack LLC
 * MIT Licensed
 */

import Debug from 'debug'
import { filter, find, map, merge, remove, uniq } from 'lodash'
import { Db, MongoClient } from 'mongodb'
import { config } from './config'
import { append, checkCyclic, validateURI } from './util'

const debug = Debug('stack')

/**
 * @summary
 *  Expose SDK query methods on Stack
 * @description
 *  Provides a range of connection/disconnect, filters and projections on mongodb
 * @returns
 *  'Stack' instance
 */
export class Stack {
  private q: any
  private config: any
  private client: any
  private collection: any
  private internal: any
  private db: Db

  constructor(...stackInfo) {
    this.config = merge(config, ...stackInfo)
    this.q = {}
    this.q = {}
    this.internal = {}
  }

  /**
   * @summary
   *  Sorts the documents based on the 'sort' key
   * @info
   *  The sort function requires that the entire sort be able to complete within 32 megabytes.
   *  When the sort option consumes more than 32 megabytes, MongoDB will return an error.
   * @param field
   */
  public ascending(field) {
    if (!(field) || typeof field !== 'string') {
      throw new Error('Kindly provide a valid field name for \'.ascending()\'')
    }
    field = append(field)
    this.internal.sort = {
      [field]: 1,
    }

    return this
  }

  /**
   * @summary
   *  Sorts the documents based on the 'sort' key
   * @info
   *  The sort function requires that the entire sort be able to complete within 32 megabytes.
   *  When the sort option consumes more than 32 megabytes, MongoDB will return an error.
   * @link
   *  https://docs.mongodb.com/manual/reference/operator/meta/orderby/
   * @param field
   */
  public descending(field) {
    if (!(field) || typeof field !== 'string') {
      throw new Error('Kindly provide a valid field name for \'.descending()\'')
    }
    field = append(field)
    this.internal.sort = {
      [field]: -1,
    }

    return this
  }

  /**
   * @summary
   *  Establish connection to mongodb
   * @param {Object} - Config overrides/mongodb specific config
   * @returns {Object} - Mongodb 'db' instance
   */
  public connect(overrides = {}) {
    return new Promise((resolve, reject) => {
      try {
        const dbConfig = merge({}, this.config, overrides)
        const uri = validateURI(dbConfig.uri || dbConfig.url)
        const options = dbConfig.options
        const dbName = dbConfig.dbName
        const client = new MongoClient(uri, options)
        this.client = client

        return client.connect().then(() => {
          this.db = client.db(dbName)
          debug('Db connection set successfully!')

          return resolve(this.db)
        }).catch(reject)
      } catch (error) {

        return reject(error)
      }
    })
  }

  /**
   * @summary
   *  Closes connection with mongodb
   */
  public close() {
    debug('Closing db connection!')
    this.client.close()
  }

  /**
   * @summary
   *  Locale on which to 'query'
   * @param {String} code - Query locale's code
   * @returns {this} - Returns `stack's` instance
   */
  public language(code) {
    if (!(code) || typeof code !== 'string' || !(find(this.config.locales, {code}))) {
      throw new Error(`Language queried is invalid ${code}`)
    }
    this.q.locale = code

    return this
  }

  /**
   * @summary
   *  Logical AND query wrapper
   * @param {Object} queries - Query filter
   * @returns {this} - Returns `stack's` instance
   */
  public and(...queries) {
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
   * @summary
   *  Logical OR query wrapper
   * @param {Object} queries - Query filter
   * @returns {this} - Returns `stack's` instance
   */
  public or(...queries) {
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
   * @summary
   *  Comparison $lt query wrapper
   * @param {String} key - Field to compare against
   * @param {any} value - Value to compare with
   * @returns {this} - Returns `stack's` instance
   */
  public lessThan(key, value) {
    if (typeof key !== 'string' || typeof value === 'undefined') {
      throw new Error('Kindly pass valid key and value parameters for \'.lessThan()\'')
    } else if (this.q.query && typeof this.q.query === 'object') {
      key = append(key)
      this.q.query[key] = {
        $lt: value,
      }
    } else {
      key = append(key)
      this.q.query = {
        [key]: {
          $lt: value,
        },
      }
    }

    return this
  }

  /**
   * @summary
   *  Comparison $lte query wrapper
   * @param {String} key - Field to compare against
   * @param {any} value - Value to compare with
   * @returns {this} - Returns `stack's` instance
   */
  public lessThanOrEqualTo(key, value) {
    if (typeof key !== 'string' || typeof value === 'undefined') {
      throw new Error('Kindly pass valid key and value parameters for \'.lessThanOrEqualTo()\'')
    } else if (this.q.query && typeof this.q.query === 'object') {
      key = append(key)
      this.q.query[key] = {
        $lte: value,
      }
    } else {
      key = append(key)
      this.q.query = {
        [key]: {
          $lte: value,
        },
      }
    }

    return this
  }

  /**
   * @summary
   *  Comparison $gt query wrapper
   * @param {String} key - Field to compare against
   * @param {any} value - Value to compare with
   * @returns {this} - Returns `stack's` instance
   */
  public greaterThan(key, value) {
    if (typeof key !== 'string' || typeof value === 'undefined') {
      throw new Error('Kindly pass valid key and value parameters for \'.greaterThan()\'')
    } else if (this.q.query && typeof this.q.query === 'object') {
      key = append(key)
      this.q.query[key] = {
        $gt: value,
      }
    } else {
      key = append(key)
      this.q.query = {
        [key]: {
          $gt: value,
        },
      }
    }

    return this
  }

  /**
   * @summary
   *  Comparison $gte query wrapper
   * @param {String} key - Field to compare against
   * @param {any} value - Value to compare with
   * @returns {this} - Returns `stack's` instance
   */
  public greaterThanOrEqualTo(key, value) {
    if (typeof key !== 'string' || typeof value === 'undefined') {
      throw new Error('Kindly pass valid key and value parameters for \'.greaterThanOrEqualTo()\'')
    } else if (this.q.query && typeof this.q.query === 'object') {
      key = append(key)
      this.q.query[key] = {
        $gte: value,
      }
    } else {
      key = append(key)
      this.q.query = {
        [key]: {
          $gte: value,
        },
      }
    }

    return this
  }

  /**
   * @summary
   *  Comparison $ne query wrapper
   * @param {String} key - Field to compare against
   * @param {any} value - Value to compare with
   * @returns {this} - Returns `stack's` instance
   */
  public notEqualTo(key, value) {
    if (typeof key !== 'string' || typeof value === 'undefined') {
      throw new Error('Kindly pass valid key and value parameters for \'.notEqualTo()\'')
    } else if (this.q.query && typeof this.q.query === 'object') {
      key = append(key)
      this.q.query[key] = {
        $ne: value,
      }
    } else {
      key = append(key)
      this.q.query = {
        [key]: {
          $ne: value,
        },
      }
    }

    return this
  }

  /**
   * @summary
   *  Comparison $in query wrapper
   * @param {String} key - Field to compare against
   * @param {any} value - Value to compare with
   * @returns {this} - Returns `stack's` instance
   */
  public containedIn(key, value) {
    if (typeof key !== 'string' || typeof value !== 'object' || !(value instanceof Array)) {
      throw new Error('Kindly pass valid key and value parameters for \'.containedIn()\'')
    } else if (this.q.query && typeof this.q.query === 'object') {
      key = append(key)
      this.q.query[key] = {
        $in: value,
      }
    } else {
      key = append(key)
      this.q.query = {
        [key]: {
          $in: value,
        },
      }
    }

    return this
  }

  /**
   * @summary
   *  Comparison $nin query wrapper
   * @param {String} key - Field to compare against
   * @param {any} value - Value to compare with
   * @returns {this} - Returns `stack's` instance
   */
  public notContainedIn(key, value) {
    if (typeof key !== 'string' || typeof value !== 'object' || !(value instanceof Array)) {
      throw new Error('Kindly pass valid key and value parameters for \'.notContainedIn()\'')
    } else if (this.q.query && typeof this.q.query === 'object') {
      key = append(key)
      this.q.query[key] = {
        $nin: value,
      }
    } else {
      key = append(key)
      this.q.query = {
        [key]: {
          $nin: value,
        },
      }
    }

    return this
  }

  /**
   * @summary
   *  Element $exists query wrapper, checks if a field exists
   * @param {String} key - Field to compare against
   * @param {any} value - Value to compare with
   * @returns {this} - Returns `stack's` instance
   */
  public exists(key) {
    if (typeof key !== 'string') {
      throw new Error('Kindly pass valid key for \'.exists()\'')
    } else if (this.q.query && typeof this.q.query === 'object') {
      key = append(key)
      this.q.query[key] = {
        $exists: true,
      }
    } else {
      key = append(key)
      this.q.query = {
        [key]: {
          $exists: true,
        },
      }
    }

    return this
  }

  /**
   * @summary
   *  Element $exists query wrapper, checks if a field does not exists
   * @param {String} key - Field to compare against
   * @param {any} value - Value to compare with
   * @returns {this} - Returns `stack's` instance
   */
  public notExists(key) {
    if (typeof key !== 'string') {
      throw new Error('Kindly pass valid key for \'.notExists()\'')
    } else if (this.q.query && typeof this.q.query === 'object') {
      key = append(key)
      this.q.query[key] = {
        $exists: false,
      }
    } else {
      key = append(key)
      this.q.query = {
        [key]: {
          $exists: false,
        },
      }
    }

    return this
  }

  /**
   * @summary
   *  Content type to query on
   * @param {String} uid - Content type uid
   * @returns {this} - Returns `stack's` instance
   */
  public contentType(uid) {
    if (uid && typeof uid === 'string') {
      this.q.content_type_uid = uid
      this.collection = this.db.collection(this.config.collectionName)

      return this
    }
    throw new Error('Kindly pass the content type\'s uid')
  }

  /**
   * @summary
   *  Query for a single entry
   * @param {String} uid - Entry uid to be found, if not provided,
   *  by default returns the 1st element in the content type.
   *  Useful for `singleton` content types
   * @returns {this} - Returns `stack's` instance
   */
  public entry(uid ? ) {
    if (!(this.q.content_type_uid)) {
      throw new Error('Kindly call \'contentType()\' before \'entry()\'!')
    }
    if (uid && typeof uid === 'string') {
      this.q.uid = uid
    }
    // this.collection = this.collection.limit(1)
    this.internal.limit = 1
    this.internal.single = true

    return this
  }

  /**
   * @summary
   *  Query for a set of entries on a content type
   * @returns {this} - Returns `stack's` instance
   */
  public entries() {
    if (this.q.content_type_uid && typeof this.q.content_type_uid === 'string') {

      return this
    }
    throw new Error('Kindly call \'contentType()\' before \'entries()\'!')
  }

  /**
   * @summary
   *  Query for a single asset
   * @param {String} uid - Asset uid to be found, if not provided,
   *  by default returns the 1st element from assets.
   * @returns {this} - Returns `stack's` instance
   */
  public asset(uid ? ) {
    if (uid && typeof uid === 'string') {
      this.q.content_type_uid = '_assets'
      this.q.uid = uid
    }
    this.collection = this.db.collection(this.config.collectionName)
    // this.collection = this.collection.limit(1)
    this.internal.limit = 1
    this.internal.single = true

    return this
  }

  /**
   * @summary
   *  Query for a set of assets
   * @returns {this} - Returns `stack's` instance
   */
  public assets() {
    this.q.content_type_uid = '_assets'
    this.collection = this.db.collection(this.config.collectionName)

    return this
  }

  /**
   * @summary
   *  Query for a single content type's schema
   * @param {String} uid - Content type uid to be found, if not provided,
   *  by default returns the 1st element from content types
   * @returns {this} - Returns `stack's` instance
   */
  public schema(uid ? ) {
    if (uid && typeof uid === 'string') {
      this.q.content_type_uid = 'contentTypes'
      this.q.uid = uid
    }
    this.collection = this.db.collection(this.config.collectionName)
    // this.collection = this.collection.limit(1)
    this.internal.limit = 1
    this.internal.single = true

    return this
  }

  /**
   * @summary
   *  Query for a set of content type schemas
   * @returns {this} - Returns `stack's` instance
   */
  public schemas() {
    this.q.content_type_uid = 'contentTypes'
    this.collection = this.db.collection(this.config.collectionName)

    return this
  }

  /**
   * @summary
   *  Parameter - used to limit the total no of items returned/scanned
   *  Defaults to 100 (internally, which is overridden)
   * @param {Number} no - Max count of the 'items' returned
   * @returns {this} - Returns `stack's` instance
   */
  public limit(no) {
    if (typeof no === 'number' && (no >= 0) && typeof this.q.content_type_uid === 'string') {
      // this.collection = this.collection.limit(no)
      this.internal.limit = no

      return this
    }
    throw new Error('Kindly provide a valid \'numeric\' value for \'limit()\'')
  }

  /**
   * @summary
   *  Parameter - used to skip initial no of items scanned
   *  Defaults to 0 (internally, which is overridden)
   * @param {Number} no - Min count of the 'items' to be scanned
   * @returns {this} - Returns `stack's` instance
   */
  public skip(no) {
    if (typeof no === 'number' && (no >= 0) && typeof this.q.content_type_uid === 'string') {
      // this.collection = this.collection.skip(no)
      this.internal.skip = no

      return this
    }
    throw new Error('Kindly provide a valid \'numeric\' value for \'skip()\'')
  }

  /**
   * @summary
   *  Raw query filter - wrapper
   * @param {Object} queryObject - Query filter
   * @returns {this} - Returns `stack's` instance
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
   * @summary
   *  Projections - returns only the fields passed here
   * @param {Array} fields - Array of 'fields', separated by dot ('.') notation for embedded document query
   * @returns {this} - Returns `stack's` instance
   */
  public only(fields) {
    if (!fields || typeof fields !== 'object' || !(fields instanceof Array) || fields.length === 0) {
      throw new Error('Kindly provide valid \'field\' values for \'only()\'')
    }
    this.internal.projections = this.internal.projections || {}
    fields.forEach((field) => {
      if (typeof field === 'string') {
        field = append(field)
        this.internal.projections[field] = 1
      } else {
        debug(`.only(): ${field} is not of type string!`)
      }
    })

    return this
  }

  /**
   * @summary
   *  Projections - returns fields except the ones passed here
   * @param {Array} fields - Array of 'fields', separated by dot ('.') notation for embedded document query
   * @returns {this} - Returns `stack's` instance
   */
  public except(fields) {
    if (!fields || typeof fields !== 'object' || !(fields instanceof Array) || fields.length === 0) {
      throw new Error('Kindly provide valid \'field\' values for \'except()\'')
    }
    this.internal.projections = this.internal.projections || {}
    fields.forEach((field) => {
      if (typeof field === 'string') {
        field = append(field)
        this.internal.projections[field] = 0
      } else {
        debug(`.except(): ${field} is not of type string!`)
      }
    })

    return this
  }

  /**
   * @summary
   *  Raw regex to be applied on a field - wrapper
   * @param {String} field - Field on which the regex is to be applied on
   * @param {pattern} pattern - Regex pattern
   * @param {options} options - Options to be applied while evaluating the regex
   * @returns {this} - Returns `stack's` instance
   */
  public regex(field, pattern, options = 'g') {
    if (!(field) || !(pattern) || typeof field !== 'string' || typeof pattern !== 'string') {
      throw new Error('Kindly provide a valid field and pattern value for \'.regex()\'')
    } else if (this.q.query && typeof this.q.query === 'object') {
      field = append(field)
      this.q.query = merge(this.q.query, {
        [field]: {
          $options: options,
          $regex: pattern,
        },
      })
    } else {
      field = append(field)
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
   * @summary
   *  Match entries that match a specific tags
   * @param {Array} values - Array of tag values
   * @returns {this} - Returns `stack's` instance
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
      this.q.query['data.tags'] = {
        $in: values,
      }
    } else {
      this.q.query = {
        'data.tags': {
          $in: values,
        },
      }
    }

    return this
  }

  /**
   * @summary
   *  Pass JS expression or a full function to the query system
   * @description
   *  - Use the $where operator to pass either a string containing a JavaScript expression
   *    or a full JavaScript function to the query system.
   *  - The $where provides greater flexibility, but requires that the database processes
   *    the JavaScript expression or function for each document in the collection.
   *  - Reference the document in the JavaScript expression or function using either this or obj.
   * @note
   *  - Only apply the $where query operator to top-level documents.
   *  - The $where query operator will not work inside a nested document, for instance,
   *    in an $elemMatch query.
   * @link
   *  https://docs.mongodb.com/manual/reference/operator/query/where/index.html
   * @param field
   * @param value
   */
  public where(...expr) {
    if (!(expr)) {
      throw new Error('Kindly provide a valid field and expr/fn value for \'.where()\'')
    } else if (this.q.query && typeof this.q.query === 'object') {
      this.q.query = merge(this.q.query, {
        $where: expr,
      })
    } else {
      this.q.query.$where = expr
    }

    return this
  }

  public count() {
    this.collection = this.collection.count()

    return this
  }

  /**
   * @summary
   *  Includes 'count' key in response, which is the total count of the items being returned
   * @returns {this} - Returns `stack's` instance
   */
  public includeCount() {
    this.internal.includeCount = true

    return this
  }

  /**
   * @summary
   *  Includes 'content_type' key in response, which is the content type schema of the entries filtered/scanned
   * @returns {this} - Returns `stack's` instance
   */
  public includeSchema() {
    this.internal.includeSchema = true

    return this
  }

  /**
   * @summary
   *  Includes all references of the entries being scanned
   * @returns {this} - Returns `stack's` instance
   */
  public includeReferences() {
    this.internal.includeReferences = true

    return this
  }

  /**
   * @summary
   *  Returns the query build thusfar
   * @returns {this} - Returns `stack's` instance
   */
  public getQuery() {
    return {
      ...this.q,
    }
  }

  /**
   * @summary
   *  Queries the db using the query built/passed
   * @description
   *  Does all the processing, filtering, referencing after querying the DB
   * @param {Object} query - Optional query object, that overrides all the previously build queries
   * @returns {Object} - Returns a objects, that have been processed, filtered and referenced
   */
  public find(query = {}) {
    return new Promise((resolve, reject) => {
      const queryFilters = this.preProcess(query)
      console.log('find() query: ' + JSON.stringify(queryFilters, null, 1))

      return this.collection
        .find(queryFilters)
        .project(this.internal.projections)
        .limit(this.internal.limit)
        .skip(this.internal.skip)
        .toArray()
        .then((result) => {
          if (this.internal.includeReferences) {
            result = map(result, 'data')

            return this.includeReferencesI(result, this.q.locale, {}, undefined)
              .then(() => {
                result = this.postProcess(result)

                return resolve(result)
              })
              .catch((refError) => {
                this.cleanup()

                return reject(refError)
              })
          } else {
            result = map(result, 'data')
            result = this.postProcess(result)

            return resolve(result)
          }
        })
        .catch((error) => {
          this.cleanup()

          return reject(error)
        })
    })
  }

  /**
   * @summary
   *  Queries the db using the query built/passed. Returns a single entry/asset/content type object
   * @description
   *  Does all the processing, filtering, referencing after querying the DB
   * @param {Object} query - Optional query object, that overrides all the previously build queries
   * @returns {Object} - Returns an object, that has been processed, filtered and referenced
   */
  public findOne(query = {}) {
    return new Promise((resolve, reject) => {
      this.internal.single = true
      const queryFilters = this.preProcess(query)
      console.log('findOne query: ' + JSON.stringify(queryFilters, null, 1))

      return this.collection
        .find(queryFilters)
        .project(this.internal.projections)
        .limit(this.internal.limit)
        .skip(this.internal.skip)
        .toArray()
        .then((result) => {
          if (this.internal.includeReferences) {
            result = map(result, 'data')

            return this.includeReferencesI(result, this.q.locale, {})
              .then(() => {
                result = this.postProcess(result)

                return resolve(result)
              })
              .catch((refError) => {
                this.cleanup()

                return reject(refError)
              })
          } else {
            result = map(result, 'data')
            result = this.postProcess(result)

            return resolve(result)
          }
        })
        .catch((error) => {
          this.cleanup()

          return reject(error)
        })
    })
  }

  /**
   * @summary
   *  Internal method, that executes and formats the queries built/passed
   * @param {Object} query - Query filter/process object
   * @returns {Object} - Returns a query object, that has been processed to be queried in mongodb
   */
  private preProcess(query) {
    let queryFilters
    if (this.q.query && typeof this.q.query === 'object') {
      this.q.query = merge(this.q.query, query)
    } else {
      this.q.query = {}
    }

    if (this.internal.projections) {
      this.internal.projections = merge(this.config.projections, this.internal.projections)
    } else {
      this.internal.projections = this.config.projections
    }

    if (!(this.internal.limit)) {
      this.internal.limit = this.config.limit
    }

    if (!(this.internal.skip)) {
      this.internal.skip = this.config.skip
    }

    if (!(this.q.locale)) {
      this.q.locale = this.config.locales[0].code
    }

    if (this.q.content_type_uid === 'contentTypes') {
      debug('Removing \'locale\' filter, since the query is on content types')
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
   * @summary
   *  Does GC, so memory doesn't stackup
   */
  private cleanup() {
    this.collection = null
    this.internal = {}
    this.q = {}
  }

  /**
   * @summary
   *  Internal method, that executes and formats the result, which the user and use
   * @param {Object} result - Result, which's to be manipulated
   * @returns {Object} - Returns the formatted version of the `result` object
   */
  private postProcess(result) {
    let contentType
    if (this.internal.includeSchema) {
      contentType = remove(result, {uid: this.q.content_type_uid})
      contentType = (typeof contentType === 'object' && contentType instanceof Array && contentType.length) ?
        contentType[0] : null
    }
    const count = (result === null) ? 0 : result.length
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
      break
    }

    if (this.internal.includeCount) {
      result.count = count
    }

    if (this.q.content_type_uid === '_assets') {
      this.q.content_type_uid = 'assets'
    }

    if (this.internal.includeSchema) {
      result.content_type = contentType
    }

    result.content_type_uid = this.q.content_type_uid
    result.locale = this.q.locale
    this.cleanup()

    return result
  }

  /**
   * @summary
   *  Internal method, that iteratively calls itself and binds entries reference
   * @param {Object} entry - An entry or a collection of entries, who's references are to be found
   * @param {String} locale - Locale, in which the reference is to be found
   * @param {Object} references - A map of uids tracked thusfar (used to detect cycle)
   * @param {String} parentUid - Entry uid, which is the parent of the current `entry` object
   * @returns {Object} - Returns `entry`, that has all of its reference binded
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
                  return self.db.collection('contents')
                    .find(query)
                    .project(self.config.projections)
                    .toArray()
                    .then((result) => {
                      const entities = map(result, 'data')
                      if (entities.length === 0) {
                        entry[prop] = []

                        return rs()
                      } else if (parentUid) {
                        references[parentUid] = references[parentUid] || []
                        references[parentUid] = uniq(references[parentUid].concat(map(entry[prop], 'uid')))
                      }
                      const referenceBucket = []
                      query.uid.$in.forEach((entityUid) => {
                        const elem = find(entities, (entity) => {
                          return entity.uid === entityUid
                        })
                        if (elem) {
                          referenceBucket.push(elem)
                        }
                      })
                      // format the references in order
                      entry[prop] = entities

                      return self.includeReferencesI(entry[prop], locale, references, parentUid)
                        .then(rs)
                        .catch(rj)
                    })
                    .catch(rj)
                }))
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