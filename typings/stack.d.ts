/*!
 * Contentstack Sync Mongodb SDK
 * Copyright (c) 2019 Contentstack LLC
 * MIT Licensed
 */
/**
 * @summary
 *  Expose SDK query methods on Stack
 * @description
 *  Provides a range of connection/disconnect, filters and projections on mongodb
 * @returns { Stack } instance
 */
export declare class Stack {
    private q;
    private config;
    private contentStore;
    private client;
    private collection;
    private internal;
    private db;
    constructor(stackConfig: any, existingDB?: any);
    /**
     * @summary
     *  Sorts the documents based on the 'sort' key
     * @info
     *  The sort function requires that the entire sort be able to complete within 32 megabytes.
     *  When the sort option consumes more than 32 megabytes, MongoDB will return an error.
     * @param field
     */
    ascending(field?: any): this;
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
    descending(field?: any): this;
    /**
     * @summary
     *  Establish connection to mongodb
     * @param {Object} - Config overrides/mongodb specific config
     * @returns {Object} - Mongodb 'db' instance
     */
    connect(overrides?: {}): Promise<{}>;
    private createIndexes;
    /**
     * @summary
     *  Closes connection with mongodb
     */
    close(): void;
    /**
     * @summary
     *  Locale on which to 'query'
     * @param {String} code - Query locale's code
     * @returns {this} - Returns `stack's` instance
     */
    language(code: any): this;
    /**
     * @summary
     *  Logical AND query wrapper
     * @param {Object} queries - Query filter
     * @returns {this} - Returns `stack's` instance
     */
    and(queries: any): this;
    /**
     * @summary
     *  Logical OR query wrapper
     * @param {Object} queries - Query filter
     * @returns {this} - Returns `stack's` instance
     */
    or(queries: any): this;
    /**
     * @summary
     *  Comparison $lt query wrapper
     * @param {String} key - Field to compare against
     * @param {any} value - Value to compare with
     * @returns {this} - Returns `stack's` instance
     */
    lessThan(key: any, value: any): this;
    /**
     * @summary
     *  Comparison $lte query wrapper
     * @param {String} key - Field to compare against
     * @param {any} value - Value to compare with
     * @returns {this} - Returns `stack's` instance
     */
    lessThanOrEqualTo(key: any, value: any): this;
    /**
     * @summary
     *  Comparison $gt query wrapper
     * @param {String} key - Field to compare against
     * @param {any} value - Value to compare with
     * @returns {this} - Returns `stack's` instance
     */
    greaterThan(key: any, value: any): this;
    /**
     * @summary
     *  Comparison $gte query wrapper
     * @param {String} key - Field to compare against
     * @param {any} value - Value to compare with
     * @returns {this} - Returns `stack's` instance
     */
    greaterThanOrEqualTo(key: any, value: any): this;
    /**
     * @summary
     *  Comparison $ne query wrapper
     * @param {String} key - Field to compare against
     * @param {any} value - Value to compare with
     * @returns {this} - Returns `stack's` instance
     */
    notEqualTo(key: any, value: any): this;
    /**
     * @summary
     *  Comparison $in query wrapper
     * @param {String} key - Field to compare against
     * @param {any} value - Value to compare with
     * @returns {this} - Returns `stack's` instance
     */
    containedIn(key: any, value: any): this;
    /**
     * @summary
     *  Comparison $nin query wrapper
     * @param {String} key - Field to compare against
     * @param {any} value - Value to compare with
     * @returns {this} - Returns `stack's` instance
     */
    notContainedIn(key: any, value: any): this;
    /**
     * @summary
     *  Element $exists query wrapper, checks if a field exists
     * @param {String} key - Field to compare against
     * @param {any} value - Value to compare with
     * @returns {this} - Returns `stack's` instance
     */
    exists(key: any): this;
    /**
     * @summary
     *  Element $exists query wrapper, checks if a field does not exists
     * @param {String} key - Field to compare against
     * @param {any} value - Value to compare with
     * @returns {this} - Returns `stack's` instance
     */
    notExists(key: any): this;
    /**
     * @summary
     *  Content type to query on
     * @param {String} uid - Content type uid
     * @returns {this} - Returns `stack's` instance
     */
    contentType(uid: any): Stack;
    /**
     * @summary
     *  Query for a single entry
     * @param {String} uid - Entry uid to be found, if not provided,
     *  by default returns the 1st element in the content type.
     *  Useful for `singleton` content types
     * @returns {this} - Returns `stack's` instance
     */
    entry(uid?: any): this;
    /**
     * @summary
     *  Query for a set of entries on a content type
     * @returns {this} - Returns `stack's` instance
     */
    entries(): this;
    /**
     * @summary
     *  Query for a single asset
     * @param {String} uid - Asset uid to be found, if not provided,
     *  by default returns the 1st element from assets.
     * @returns {this} - Returns `stack's` instance
     */
    asset(uid?: any): Stack;
    /**
     * @summary
     *  Query for a set of assets
     * @returns {this} - Returns `stack's` instance
     */
    assets(): Stack;
    /**
     * @summary
     *  Query for a single content type's schema
     * @param {String} uid - Content type uid to be found, if not provided,
     *  by default returns the 1st element from content types
     * @returns {this} - Returns `stack's` instance
     */
    schema(uid?: any): Stack;
    /**
     * @summary
     *  Query for a set of content type schemas
     * @returns {this} - Returns `stack's` instance
     */
    schemas(): Stack;
    /**
     * @summary
     *  Parameter - used to limit the total no of items returned/scanned
     *  Defaults to 100 (internally, which is overridden)
     * @param {Number} no - Max count of the 'items' returned
     * @returns {this} - Returns `stack's` instance
     */
    limit(no: any): this;
    /**
     * @summary
     *  Parameter - used to skip initial no of items scanned
     *  Defaults to 0 (internally, which is overridden)
     * @param {Number} no - Min count of the 'items' to be scanned
     * @returns {this} - Returns `stack's` instance
     */
    skip(no: any): this;
    /**
     * @summary
     *  Raw query filter - wrapper
     * @param {Object} queryObject - Query filter
     * @returns {this} - Returns `stack's` instance
     */
    query(queryObject?: {}): this;
    /**
     * @summary
     *  Projections - returns only the fields passed here
     * @param {Array} fields - Array of 'fields', separated by dot ('.') notation for embedded document query
     * @returns {this} - Returns `stack's` instance
     */
    only(fields: any): this;
    /**
     * @summary
     *  Projections - returns fields except the ones passed here
     * @param {Array} fields - Array of 'fields', separated by dot ('.') notation for embedded document query
     * @returns {this} - Returns `stack's` instance
     */
    except(fields: any): this;
    /**
     * @summary
     *  Raw regex to be applied on a field - wrapper
     * @param {String} field - Field on which the regex is to be applied on
     * @param {pattern} pattern - Regex pattern
     * @param {options} options - Options to be applied while evaluating the regex
     * @returns {this} - Returns `stack's` instance
     */
    regex(field: any, pattern: any, options?: string): this;
    /**
     * @summary
     *  Match entries that match a specific tags
     * @param {Array} values - Array of tag values
     * @returns {this} - Returns `stack's` instance
     */
    tags(values: any): this;
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
    where(expr: any): this;
    /**
     * @summary
     *  Includes 'count' key in response, which is the total count of the items being returned
     * @returns {this} - Returns `stack's` instance
     */
    includeCount(): this;
    /**
     * @summary
     *  Includes 'content_type' key in response, which is the content type schema of the entries filtered/scanned
     * @returns {this} - Returns `stack's` instance
     */
    includeSchema(): this;
    /**
     * @summary
     *  Includes 'content_type' key in response, which is the content type schema of the entries filtered/scanned
     * @returns {this} - Returns `stack's` instance
     */
    includeContentType(): this;
    /**
     * @summary
     *  Includes all references of the entries being scanned
     * @returns {this} - Returns `stack's` instance
     */
    includeReferences(): this;
    /**
     * @summary
     *  Excludes all references of the entries being scanned
     * @returns {this} - Returns `stack's` instance
     */
    excludeReferences(): this;
    /**
     * @summary
     *  Wrapper, that allows querying on the entry's references.
     * @note
     *  This is a slow method, since it scans all documents and fires the `reference` query on them
     *  Use `.query()` filters to reduce the total no of documents being scanned
     * @returns {this} - Returns `stack's` instance
     */
    queryReferences(query: any): this;
    /**
     * @summary
     *  Returns the query build thusfar
     * @returns {this} - Returns `stack's` instance
     */
    getQuery(): any;
    /**
     * @summary
     *  Queries the db using the query built/passed
     * @description
     *  Does all the processing, filtering, referencing after querying the DB
     * @param {Object} query - Optional query object, that overrides all the previously build queries
     * @returns {Object} - Returns a objects, that have been processed, filtered and referenced
     */
    find(query?: {}): Promise<{}>;
    count(query?: any): Promise<{}>;
    /**
     * @summary
     *  Queries the db using the query built/passed. Returns a single entry/asset/content type object
     * @description
     *  Does all the processing, filtering, referencing after querying the DB
     * @param {Object} query - Optional query object, that overrides all the previously build queries
     * @returns {Object} - Returns an object, that has been processed, filtered and referenced
     */
    findOne(query?: {}): Promise<{}>;
    private queryOnReferences;
    /**
     * @summary
     *  Internal method, that executes and formats the queries built/passed
     * @param {Object} query - Query filter/process object
     * @returns {Object} - Returns a query object, that has been processed to be queried in mongodb
     */
    private preProcess;
    /**
     * @summary
     *  Does GC, so memory doesn't stackup
     */
    private cleanup;
    /**
     * @summary
     *  Internal method, that executes and formats the result, which the user and use
     * @param {Object} result - Result, which's to be manipulated
     * @returns {Object} - Returns the formatted version of the `result` object
     */
    private postProcess;
    /**
     * @summary
     *  Internal method, that iteratively calls itself and binds entries reference
     * @param {Object} entry - An entry or a collection of entries, who's references are to be found
     * @param {String} locale - Locale, in which the reference is to be found
     * @param {Object} references - A map of uids tracked thusfar (used to detect cycle)
     * @param {String} parentUid - Entry uid, which is the parent of the current `entry` object
     * @returns {Object} - Returns `entry`, that has all of its reference binded
     */
    private includeReferencesI;
}
