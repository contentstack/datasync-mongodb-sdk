import Debug from 'debug'
import { find, map, merge, remove } from 'lodash'
import { Db, MongoClient } from 'mongodb'
import { config } from './config'
import { append, validateURI } from './util'

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
  private _query: any
  private config: any
  private client: any
  private collection: any
  private internal: any
  private db: Db

  constructor(...stackInfo) {
    this.config = merge(config, ...stackInfo)
    this._query = {}
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

  public connect(overrides = {}) {
    return new Promise((resolve, reject) => {
      try {
        const config = merge({}, this.config, overrides)
        const uri = validateURI(config.uri || config.url)
        const options = config.options
        const dbName = config.dbName
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

  public close() {
    debug('Closing db connection!')
    this.client.close()
  }

  public language(code) {
    if (!(code) || typeof code !== 'string' || !(find(this.config.locales, {code}))) {
      throw new Error(`Language queried is invalid ${code}`)
    }
    this._query.locale = code

    return this
  }

  public and(...queries) {
    if (this._query.query && typeof this._query.query === 'object') {
      this._query.query = merge(this._query.query, {
        $and: queries,
      })
    } else {
      this._query.query = {
        $and: queries,
      }
    }

    return this
  }

  public or(...queries) {
    if (this._query.query && typeof this._query.query === 'object') {
      this._query.query = merge(this._query.query, {
        $or: queries,
      })
    } else {
      this._query.query = {
        $or: queries,
      }
    }

    return this
  }

  public lessThan(key, value) {
    if (typeof key !== 'string' || typeof value === 'undefined') {
      throw new Error('Kindly pass valid key and value parameters for \'.lessThan()\'')
    } else if (this._query.query && typeof this._query.query === 'object') {
      key = append(key)
      this._query.query[key] = {
        $lt: value,
      }
    } else {
      key = append(key)
      this._query = {
        query: {
          [key]: {
            $lt: value,
          },
        },
      }
    }

    return this
  }

  public lessThanOrEqualTo(key, value) {
    if (typeof key !== 'string' || typeof value === 'undefined') {
      throw new Error('Kindly pass valid key and value parameters for \'.lessThanOrEqualTo()\'')
    } else if (this._query.query && typeof this._query.query === 'object') {
      key = append(key)
      this._query.query[key] = {
        $lte: value,
      }
    } else {
      key = append(key)
      this._query = {
        query: {
          [key]: {
            $lte: value,
          },
        },
      }
    }

    return this
  }

  public greaterThan(key, value) {
    if (typeof key !== 'string' || typeof value === 'undefined') {
      throw new Error('Kindly pass valid key and value parameters for \'.greaterThan()\'')
    } else if (this._query.query && typeof this._query.query === 'object') {
      key = append(key)
      this._query.query[key] = {
        $gt: value,
      }
    } else {
      key = append(key)
      this._query = {
        query: {
          [key]: {
            $gt: value,
          },
        },
      }
    }

    return this
  }

  public greaterThanOrEqualTo(key, value) {
    if (typeof key !== 'string' || typeof value === 'undefined') {
      throw new Error('Kindly pass valid key and value parameters for \'.greaterThanOrEqualTo()\'')
    } else if (this._query.query && typeof this._query.query === 'object') {
      key = append(key)
      this._query.query[key] = {
        $gte: value,
      }
    } else {
      key = append(key)
      this._query = {
        query: {
          [key]: {
            $gte: value,
          },
        },
      }
    }

    return this
  }

  public notEqualTo(key, value) {
    if (typeof key !== 'string' || typeof value === 'undefined') {
      throw new Error('Kindly pass valid key and value parameters for \'.notEqualTo()\'')
    } else if (this._query.query && typeof this._query.query === 'object') {
      key = append(key)
      this._query.query[key] = {
        $ne: value,
      }
    } else {
      key = append(key)
      this._query = {
        query: {
          [key]: {
            $ne: value,
          },
        },
      }
    }

    return this
  }

  public containedIn(key, value) {
    if (typeof key !== 'string' || typeof value !== 'object' || !(value instanceof Array)) {
      throw new Error('Kindly pass valid key and value parameters for \'.containedIn()\'')
    } else if (this._query.query && typeof this._query.query === 'object') {
      key = append(key)
      this._query.query[key] = {
        $in: value,
      }
    } else {
      key = append(key)
      this._query = {
        query: {
          [key]: {
            $in: value,
          },
        },
      }
    }

    return this
  }

  public notContainedIn(key, value) {
    if (typeof key !== 'string' || typeof value !== 'object' || !(value instanceof Array)) {
      throw new Error('Kindly pass valid key and value parameters for \'.notContainedIn()\'')
    } else if (this._query.query && typeof this._query.query === 'object') {
      key = append(key)
      this._query.query[key] = {
        $nin: value,
      }
    } else {
      key = append(key)
      this._query = {
        query: {
          [key]: {
            $nin: value,
          },
        },
      }
    }

    return this
  }

  public exists(key) {
    if (typeof key !== 'string') {
      throw new Error('Kindly pass valid key for \'.exists()\'')
    } else if (this._query.query && typeof this._query.query === 'object') {
      key = append(key)
      this._query.query[key] = {
        $exists: true,
      }
    } else {
      key = append(key)
      this._query = {
        query: {
          [key]: {
            $exists: true,
          },
        },
      }
    }

    return this
  }

  public notExists(key) {
    if (typeof key !== 'string') {
      throw new Error('Kindly pass valid key for \'.notExists()\'')
    } else if (this._query.query && typeof this._query.query === 'object') {
      key = append(key)
      this._query.query[key] = {
        $exists: false,
      }
    } else {
      key = append(key)
      this._query = {
        query: {
          [key]: {
            $exists: false,
          },
        },
      }
    }

    return this
  }

  public contentType(uid) {
    if (uid && typeof uid === 'string') {
      this._query.content_type_uid = uid
      this.collection = this.db.collection(this.config.collectionName)

      return this
    }
    throw new Error('Kindly pass the content type\'s uid')
  }

  public entry(uid ? ) {
    if (!(this._query.content_type_uid)) {
      throw new Error('Kindly call \'contentType()\' before \'entry()\'!')
    }
    if (uid && typeof uid === 'string') {
      this._query.uid = uid
    }
    // this.collection = this.collection.limit(1)
    this.internal.limit = 1
    this.internal.single = true

    return this
  }

  public entries() {
    if (this._query.content_type_uid && typeof this._query.content_type_uid === 'string') {

      return this
    }
    throw new Error('Kindly call \'contentType()\' before \'entries()\'!')
  }

  public asset(uid ? ) {
    if (uid && typeof uid === 'string') {
      this._query.content_type_uid = '_assets'
      this._query.uid = uid
    }
    this.collection = this.db.collection(this.config.collectionName)
    // this.collection = this.collection.limit(1)
    this.internal.limit = 1
    this.internal.single = true

    return this
  }

  public assets() {
    this._query.content_type_uid = '_assets'
    this.collection = this.db.collection(this.config.collectionName)

    return this
  }

  public schema(uid ? ) {
    if (uid && typeof uid === 'string') {
      this._query.content_type_uid = 'contentTypes'
      this._query.uid = uid
    }
    this.collection = this.db.collection(this.config.collectionName)
    // this.collection = this.collection.limit(1)
    this.internal.limit = 1
    this.internal.single = true

    return this
  }

  public schemas() {
    this._query.content_type_uid = 'contentTypes'
    this.collection = this.db.collection(this.config.collectionName)

    return this
  }

  public limit(no) {
    if (typeof no === 'number' && (no >= 0) && typeof this._query.content_type_uid === 'string') {
      // this.collection = this.collection.limit(no)
      this.internal.limit = no

      return this
    }
    throw new Error('Kindly provide a valid \'numeric\' value for \'limit()\'')
  }

  public skip(no) {
    if (typeof no === 'number' && (no >= 0) && typeof this._query.content_type_uid === 'string') {
      // this.collection = this.collection.skip(no)
      this.internal.skip = no

      return this
    }
    throw new Error('Kindly provide a valid \'numeric\' value for \'skip()\'')
  }

  public query(queryObject = {}) {
    if (this._query.query && typeof this._query.query === 'object') {
      this._query.query = merge(this._query.query, queryObject)
    } else {
      this._query.query = queryObject
    }

    return this
  }

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

  public regex(field, pattern, options = 'g') {
    if (!(field) || !(pattern) || typeof field !== 'string' || typeof pattern !== 'string') {
      throw new Error('Kindly provide a valid field and pattern value for \'.regex()\'')
    } else if (this._query.query && typeof this._query.query === 'object') {
      field = append(field)
      this._query.query = merge(this._query.query, {
        [field]: {
          $options: options,
          $regex: pattern,
        },
      })
    } else {
      field = append(field)
      this._query.query = {
        [field]: {
          $regex: pattern,
          $options: options,
        },
      }
    }

    return this
  }

  public tags(values) {
    if (!values || typeof values !== 'object' || !(values instanceof Array) || values.length === 0) {
      throw new Error('Kindly provide valid \'field\' values for \'tags()\'')
    }
    // filter non-string keys
    remove(values, (value) => {
      return typeof value !== 'string'
    })

    if (this._query.query && typeof this._query.query === 'object') {
      this._query.query['data.tags'] = {
        $in: values,
      }
    } else {
      this._query.query = {
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
    } else if (this._query.query && typeof this._query.query === 'object') {
      this._query.query = merge(this._query.query, {
        $where: expr,
      })
    } else {
      this._query.query.$where = expr
    }

    return this
  }

  public count() {
    this.collection = this.collection.count()

    return this
  }

  public includeCount() {
    this.internal.includeCount = true

    return this
  }

  public includeSchema() {
    this.internal.includeSchema = true

    return this
  }

  public getQuery() {
    return {
      ...this._query,
    }
  }

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
          result = this.postProcess(result)

          return resolve(result)
        })
        .catch((error) => {
          this.cleanup()

          return reject(error)
        })
    })
  }

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
          result = this.postProcess(result)

          return resolve(result)
        })
        .catch((error) => {
          this.cleanup()

          return reject(error)
        })
    })
  }

  private preProcess(query) {
    let queryFilters
    if (this._query.query && typeof this._query.query === 'object') {
      this._query.query = merge(this._query.query, query)
    } else {
      this._query.query = {}
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

    if (!(this._query.locale)) {
      this._query.locale = this.config.locales[0].code
    }

    if (this._query.content_type_uid === 'contentTypes') {
      debug('Removing \'locale\' filter, since the query is on content types')
      delete this._query.locale
    }

    const filters = {
      content_type_uid: this._query.content_type_uid,
      locale: this._query.locale,
      ...this._query.query,
    }

    if (this.internal.includeSchema) {
      // since, content type will take up 1 item-space
      this.internal.limit += 1
      queryFilters = {
        $or: [
          filters,
          {
            uid: this._query.content_type_uid,
          },
        ],
      }
    } else {
      queryFilters = filters
    }

    return queryFilters
  }

  private cleanup() {
    this.collection = null
    this.internal = {}
    this._query = {}
  }

  private postProcess(result) {
    result = map(result, 'data')
    let contentType
    if (this.internal.includeSchema) {
      contentType = remove(result, {uid: this._query.content_type_uid})
    }
    const count = (result === null) ? 0 : result.length
    switch (this._query.content_type_uid) {
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

    if (this._query.content_type_uid === '_assets') {
      this._query.content_type_uid = 'assets'
    }

    if (this.internal.includeSchema) {
      result.content_type = contentType
    }

    result.content_type_uid = this._query.content_type_uid
    result.locale = this._query.locale
    this.cleanup()

    return result
  }
}
