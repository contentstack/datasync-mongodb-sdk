import Debug from 'debug'
import { map, merge, remove } from 'lodash'
import { MongoClient, Db } from 'mongodb'
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

  constructor(...stack_arguments) {
    this.config = merge(config, ...stack_arguments)
    this._query = {}
    this.internal = {}
    this.db
    this.client
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
    this.internal.sort = {
      [field]: 1
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
    this.internal.sort = {
      [field]: -1
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

  public and(...queries) {
    if (this._query._query && typeof this._query._query === 'object') {
      this._query._query = merge(this._query._query, {$and: queries})
    } else {
      this._query._query = { 
        $and: queries 
      }
    }

    return this
  }

  public or(...queries) {
    if (this._query._query && typeof this._query._query === 'object') {
      this._query._query = merge(this._query._query, {$or: queries})
    } else {
      this._query._query = { 
        $or: queries 
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

  public entry(uid?) {
    if (!(this._query.content_type_uid)) {
      throw new Error('Kindly call \'contentType()\' before \'entry()\'!')
    }
    if (uid && typeof uid === 'string') {
      this._query.uid = uid
    }
    this.collection = this.collection.limit(1)
    this.internal.single = true

    return this
  }

  public entries() {
    if (this._query.content_type_uid && typeof this._query.content_type_uid === 'string') {

      return this
    }
    throw new Error('Kindly call \'contentType()\' before \'entries()\'!')
  }

  public asset(uid?) {
    if (uid && typeof uid === 'string') {
      this._query.content_type_uid = '_assets'
      this._query.uid = uid
    }
    this.collection = this.db.collection(this.config.collectionName)
    this.collection = this.collection.limit(1)
    this.internal.single = true

    return this
  }

  public assets() {
    this._query.content_type_uid = '_assets'
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
    fields.forEach(field => {
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
    fields.forEach(field => {
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
      this._query.query = merge(this._query.query, {
        [field]: {
          $regex: pattern,
          $options: options
        }
      })
    } else {
      this._query.query = {
        [field]: {
          $regex: pattern,
          $options: options
        }
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

    this._query.data = this._query.data || {}
    this._query.data.tags = {
      $in: values
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
        $where: expr
      })
    } else {
      this._query.query = {
        $where: expr
      }
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

  private preProcess (query) {
    if (this._query.query && typeof this._query.query === 'object') {
      this._query.query = merge(this._query.query, query)
      this._query.query = {
        data: this._query.query
      }
    } else {
      this._query.query = {}
    }

    if (this.internal.projections) {
      this.internal.projections._id = 0
    } else {
      this.internal.projections = {
        '_id': 0
      }
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
  }

  private postProcess(result) {
    result = map(result, 'data')
    const count = (result === null) ? 0: result.length
    switch (this._query.content_type_uid) {
      case '_assets':
        if (this.internal.limit === 1) {
          result = {
            asset: (result === null) ? result: result[0]
          }
        } else {
          result = {
            assets: result
          }
        }

        break
      case 'contentTypes':
        if (this.internal.limit === 1) {
          result = {
            content_type: (result === null) ? result: result[0]
          }
        } else {
          result = {
            content_types: result
          }
        }
        break
      default:
        if (this.internal.limit === 1) {
          result = {
            entry: (result === null) ? result: result[0]
          }
        } else {
          result = {
            entries: result
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
    result.content_type_uid = this._query.content_type_uid
    result.locale = this._query.locale
    this.cleanup()

    return result
  }

  private cleanup() {
    this.query = null
    this.internal = {}
    this._query = {}
  }

  public find(query = {}) {
    return new Promise((resolve, reject) => {
      this.preProcess(query)
      const filters = {
        content_type_uid: this._query.content_type_uid,
        locale: this._query.locale,
        ...this._query.query
      }

      return this.collection
        .find(filters, this.internal.projections)
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
}
