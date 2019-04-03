/*!
 * Contentstack DataSync Mongodb SDK
 * Copyright (c) 2019 Contentstack LLC
 * MIT Licensed
 */
/**
 * @class Stack
 * @description Expose SDK query methods on Stack
 * @constructor
 * @description Provides a range of connection/disconnect, filters and projections on mongodb
 * @returns {Stack} Returns an instance of `Stack`
 */
export declare class Stack {
    private q;
    private config;
    private contentStore;
    private types;
    private client;
    private collection;
    private internal;
    private db;
    constructor(stackConfig: any, existingDB?: any);
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
    ascending(field?: any): this;
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
    descending(field?: any): this;
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
    connect(overrides?: {}): Promise<{}>;
    private createIndexes;
    /**
     * @public
     * @method close
     * @summary Closes connection with mongodb
     */
    close(): void;
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
    language(code: any): this;
    /**
     * @public
     * @method and
     * @summary Logical AND query wrapper
     * @description Accepts 2 queries and returns only those documents, that satisfy both the query conditions
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
    and(queries: any): this;
    /**
     * @public
     * @method or
     * @summary Logical OR query wrapper
     * @description Accepts 2 queries and returns only those documents, that satisfy either of the query conditions
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
    or(queries: any): this;
    /**
     * @public
     * @method lessThan
     * @summary Comparison $lt query wrapper
     * @description
     * Compares the field/key provided against the provided value. Only documents that have lower value than the one provided are returned.
     * Check https://docs.mongodb.com/manual/reference/operator/query/lt/ and https://docs.mongodb.com/manual/reference/method/db.collection.find/#type-bracketing for more info
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
    lessThan(key: any, value: any): this;
    /**
     * @public
     * @method lessThanOrEqualTo
     * @summary Comparison $lte query wrapper
     * @description
     * Compares the field/key provided against the provided value. Only documents that have lower or equal value than the one provided are returned.
     * Check https://docs.mongodb.com/manual/reference/operator/query/lte/ and https://docs.mongodb.com/manual/reference/method/db.collection.find/#type-bracketing for more info
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
    lessThanOrEqualTo(key: any, value: any): this;
    /**
     * @public
     * @method greaterThan
     * @summary Comparison $gt query wrapper
     * @description
     * Compares the field/key provided against the provided value. Only documents that have greater value than the one provided are returned.
     * Check {@link https://docs.mongodb.com/manual/reference/operator/query/gt/ }and https://docs.mongodb.com/manual/reference/method/db.collection.find/#type-bracketing for more info
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
    greaterThan(key: any, value: any): this;
    /**
     * @public
     * @method greaterThanOrEqualTo
     * @summary Comparison $gte query wrapper
     * @description
     * Compares the field/key provided against the provided value. Only documents that have greater than or equal value than the one provided are returned.
     * Check https://docs.mongodb.com/manual/reference/operator/query/gte/ and https://docs.mongodb.com/manual/reference/method/db.collection.find/#type-bracketing for more info
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
    greaterThanOrEqualTo(key: any, value: any): this;
    /**
     * @public
     * @method notEqualTo
     * @summary Comparison $ne query wrapper
     * @description
     * Compares the field/key provided against the provided value. Only documents that have value not equals than the one provided are returned.
     *
     * Check mongodb query here: {@link https://docs.mongodb.com/manual/reference/operator/query/ne/}.
     *
     * Res: {@link https://docs.mongodb.com/manual/reference/method/db.collection.find/#type-bracketing}.
     *
     * Comparison ordering {@link https://docs.mongodb.com/manual/reference/bson-type-comparison-order/#bson-types-comparison-order}
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
    notEqualTo(key: any, value: any): this;
    /**
     * @public
     * @method containedIn
     * @summary Comparison $in query wrapper
     * @description
     * Compares the field/key provided against the provided value. Only documents that have value contained in the field/key provided are returned.
     *
     * Check mongodb query here: {@link https://docs.mongodb.com/manual/reference/operator/query/in/}.
     *
     * Res: {@link https://docs.mongodb.com/manual/reference/method/db.collection.find/#type-bracketing}.
     *
     * Comparison ordering {@link https://docs.mongodb.com/manual/reference/bson-type-comparison-order/#bson-types-comparison-order}
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
    containedIn(key: any, value: any): this;
    /**
     * @public
     * @method notContainedIn
     * @summary Comparison $nin query wrapper
     * @description
     * Compares the field/key provided against the provided value. Only documents that have value not contained in the field/key provided are returned.
     *
     * Check mongodb query here: {@link https://docs.mongodb.com/manual/reference/operator/query/nin/}.
     *
     * Res: {@link https://docs.mongodb.com/manual/reference/method/db.collection.find/#type-bracketing}.
     *
     * Comparison ordering {@link https://docs.mongodb.com/manual/reference/bson-type-comparison-order/#bson-types-comparison-order}
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
    notContainedIn(key: any, value: any): this;
    /**
     * @public
     * @method exists
     * @summary Element $exists query wrapper, checks if a field exists
     * @description
     * Compares the field/key provided against the provided value. Only documents that have the field/key specified are returned.
     *
     * Check mongodb query here: {@link https://docs.mongodb.com/manual/reference/operator/query/exists/}.
     *
     * Res: {@link https://docs.mongodb.com/manual/reference/method/db.collection.find/#type-bracketing}.
     *
     * Comparison ordering {@link https://docs.mongodb.com/manual/reference/bson-type-comparison-order/#bson-types-comparison-order}
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
    exists(key: any): this;
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
     * Comparison ordering {@link https://docs.mongodb.com/manual/reference/bson-type-comparison-order/#bson-types-comparison-order}
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
    notExists(key: any): this;
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
    contentType(uid: any): Stack;
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
     *    // returns the entry based on its 'uid', if not provided, it would return the 1st entry found in 'blog' content type
     *  })
     *  .catch((error) => {
     *    // handle query errors
     *  })
     *
     * @returns {Stack} Returns an instance of 'stack'
     */
    entry(uid?: any): this;
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
    entries(): this;
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
    asset(uid?: any): Stack;
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
    assets(): Stack;
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
    schema(uid?: any): Stack;
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
    schemas(): Stack;
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
    limit(no: any): this;
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
    skip(no: any): this;
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
    query(queryObject?: {}): this;
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
    only(fields: any): this;
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
    except(fields: any): this;
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
    regex(field: any, pattern: any, options?: string): this;
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
    tags(values: any): this;
    /**
     * @method where
     * @summary Pass JS expression or a full function to the query system
     * @description
     * Use the $where operator to pass either a string containing a JavaScript expression or a full JavaScript function to the query system.
     * The $where provides greater flexibility, but requires that the database processes the JavaScript expression or function for each document in the collection.
     * Reference the document in the JavaScript expression or function using either this or obj.
     * Only apply the $where query operator to top-level documents.
     * The $where query operator will not work inside a nested document, for instance, in an $elemMatch query.
     * Ref. - https://docs.mongodb.com/manual/reference/operator/query/where/index.html
     * @param {*} expr Pass either a string containing a JavaScript expression or a full JavaScript function to the query system.
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
    where(expr: any): this;
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
    includeCount(): this;
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
    includeSchema(): this;
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
    includeContentType(): this;
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
    includeReferences(): this;
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
    excludeReferences(): this;
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
    queryReferences(query: any): this;
    queryReferencesBeta(query: any): this;
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
    getQuery(): any;
    include(fields: any): this;
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
    find(query?: {}): Promise<{}>;
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
    count(query?: any): Promise<{}>;
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
    findOne(query?: {}): Promise<{}>;
    /**
     * @private
     * @method preProcess
     * @summary Internal method, that executes and formats the queries built/passed
     * @param {object} query Query filter/process object
     * @returns {object} Returns a query object, that has been processed to be queried in mongodb
     */
    private preProcess;
    /**
     * @private
     * @method cleanup
     * @summary Does GC, so memory doesn't stackup
     */
    private cleanup;
    /**
     * @private
     * @method postProcess
     * @summary Internal method, that executes and formats the result, which the user and use
     * @param {object} result Result, which's to be manipulated
     * @returns {object} Returns the formatted version of the `result` object
     */
    private postProcess;
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
    private includeReferencesI;
    private isPartOfInclude;
    /**
     * @summary
     *  Internal method, that iteratively calls itself and binds entries reference
     * @param {Object} entry - An entry or a collection of entries, who's references are to be found
     * @param {String} locale - Locale, in which the reference is to be found
     * @param {Object} references - A map of uids tracked thusfar (used to detect cycle)
     * @param {String} parentUid - Entry uid, which is the parent of the current `entry` object
     * @returns {Object} - Returns `entry`, that has all of its reference binded
     */
    private includeSpecificReferences;
    /**
     * [
     *  'category.authors'
     *  'category'
     *  'authors.types'
     * ]
     */
    private excludeSpecificReferences;
}
