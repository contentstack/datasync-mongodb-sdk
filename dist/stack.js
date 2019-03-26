"use strict";
/*!
 * Contentstack Sync Mongodb SDK
 * Copyright (c) 2019 Contentstack LLC
 * MIT Licensed
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const mongodb_1 = require("mongodb");
const sift_1 = __importDefault(require("sift"));
const config_1 = require("./config");
const util_1 = require("./util");
/**
 * @summary
 *  Expose SDK query methods on Stack
 * @description
 *  Provides a range of connection/disconnect, filters and projections on mongodb
 * @returns { Stack } instance
 */
class Stack {
    constructor(stackConfig, existingDB) {
        this.config = lodash_1.merge(config_1.config, stackConfig);
        this.contentStore = this.config.contentStore;
        this.q = {};
        this.internal = {};
        this.db = existingDB;
    }
    /**
     * @summary
     *  Sorts the documents based on the 'sort' key
     * @info
     *  The sort function requires that the entire sort be able to complete within 32 megabytes.
     *  When the sort option consumes more than 32 megabytes, MongoDB will return an error.
     * @param field
     */
    ascending(field) {
        if (typeof this.q.content_type_uid !== 'string') {
            throw new Error('Kindly call \'.contentType()\' before \.ascending()\'');
        }
        if (!(field) || typeof field !== 'string') {
            // throw new Error('Kindly provide a valid field name for \'.ascending()\'')
            if (this.internal.sort && typeof this.internal.sort === 'object') {
                this.internal.sort.published_at = 1;
            }
            else {
                this.internal.sort = {
                    published_at: 1,
                };
            }
        }
        else {
            if (this.internal.sort && typeof this.internal.sort === 'object') {
                this.internal.sort[field] = 1;
            }
            else {
                this.internal.sort = {
                    [field]: 1,
                };
            }
        }
        return this;
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
    descending(field) {
        if (typeof this.q.content_type_uid !== 'string') {
            throw new Error('Kindly call \'.contentType()\' before \.descending()\'');
        }
        if (!(field) || typeof field !== 'string') {
            // throw new Error('Kindly provide a valid field name for \'.descending()\'')
            if (this.internal.sort && typeof this.internal.sort === 'object') {
                this.internal.sort.published_at = -1;
            }
            else {
                this.internal.sort = {
                    published_at: -1,
                };
            }
        }
        else {
            if (this.internal.sort && typeof this.internal.sort === 'object') {
                this.internal.sort[field] = -1;
            }
            else {
                this.internal.sort = {
                    [field]: -1,
                };
            }
        }
        return this;
    }
    /**
     * @summary
     *  Establish connection to mongodb
     * @param {Object} - Config overrides/mongodb specific config
     * @returns {Object} - Mongodb 'db' instance
     */
    connect(overrides = {}) {
        return new Promise((resolve, reject) => {
            try {
                const dbConfig = lodash_1.merge({}, this.config, overrides).contentStore;
                const uri = util_1.validateURI(dbConfig.uri || dbConfig.url);
                const options = dbConfig.options;
                const dbName = dbConfig.dbName;
                const client = new mongodb_1.MongoClient(uri, options);
                this.client = client;
                return client.connect().then(() => {
                    this.db = client.db(dbName);
                    resolve(this.db);
                    // Create indexes in the background
                    const bucket = [];
                    const indexes = this.config.contentStore.indexes;
                    const collectionName = this.config.contentStore.collectionName;
                    for (let index in indexes) {
                        if (indexes[index] === 1 || indexes[index] === -1) {
                            bucket.push(this.createIndexes(this.config.contentStore.collectionName, index, indexes[index]));
                        }
                    }
                    Promise.all(bucket)
                        .then(() => {
                        console.info(`Indexes created successfully in '${collectionName}' collection`);
                    })
                        .catch((error) => {
                        console.error(`Failed while creating indexes in '${collectionName}' collection`);
                        console.error(error);
                    });
                }).catch(reject);
            }
            catch (error) {
                return reject(error);
            }
        });
    }
    createIndexes(collectionId, index, type) {
        return this.db.collection(collectionId)
            .createIndex({
            [index]: type
        })
            .then(() => {
            console.info(`Index '${index}' created successfully!`);
            return;
        });
    }
    /**
     * @summary
     *  Closes connection with mongodb
     */
    close() {
        this.client.close();
    }
    /**
     * @summary
     *  Locale on which to 'query'
     * @param {String} code - Query locale's code
     * @returns {this} - Returns `stack's` instance
     */
    language(code) {
        if (!(code) || typeof code !== 'string' || !(lodash_1.find(this.config.locales, { code }))) {
            throw new Error(`Language queried is invalid ${code}`);
        }
        this.q.locale = code;
        return this;
    }
    /**
     * @summary
     *  Logical AND query wrapper
     * @param {Object} queries - Query filter
     * @returns {this} - Returns `stack's` instance
     */
    and(queries) {
        if (this.q.query && typeof this.q.query === 'object') {
            this.q.query = lodash_1.merge(this.q.query, {
                $and: queries,
            });
        }
        else {
            this.q.query = {
                $and: queries,
            };
        }
        return this;
    }
    /**
     * @summary
     *  Logical OR query wrapper
     * @param {Object} queries - Query filter
     * @returns {this} - Returns `stack's` instance
     */
    or(queries) {
        if (this.q.query && typeof this.q.query === 'object') {
            this.q.query = lodash_1.merge(this.q.query, {
                $or: queries,
            });
        }
        else {
            this.q.query = {
                $or: queries,
            };
        }
        return this;
    }
    /**
     * @summary
     *  Comparison $lt query wrapper
     * @param {String} key - Field to compare against
     * @param {any} value - Value to compare with
     * @returns {this} - Returns `stack's` instance
     */
    lessThan(key, value) {
        if (typeof key !== 'string' || typeof value === 'undefined') {
            throw new Error('Kindly pass valid key and value parameters for \'.lessThan()\'');
        }
        else if (this.q.query && typeof this.q.query === 'object') {
            this.q.query[key] = {
                $lt: value,
            };
        }
        else {
            this.q.query = {
                [key]: {
                    $lt: value,
                },
            };
        }
        return this;
    }
    /**
     * @summary
     *  Comparison $lte query wrapper
     * @param {String} key - Field to compare against
     * @param {any} value - Value to compare with
     * @returns {this} - Returns `stack's` instance
     */
    lessThanOrEqualTo(key, value) {
        if (typeof key !== 'string' || typeof value === 'undefined') {
            throw new Error('Kindly pass valid key and value parameters for \'.lessThanOrEqualTo()\'');
        }
        else if (this.q.query && typeof this.q.query === 'object') {
            this.q.query[key] = {
                $lte: value,
            };
        }
        else {
            this.q.query = {
                [key]: {
                    $lte: value,
                },
            };
        }
        return this;
    }
    /**
     * @summary
     *  Comparison $gt query wrapper
     * @param {String} key - Field to compare against
     * @param {any} value - Value to compare with
     * @returns {this} - Returns `stack's` instance
     */
    greaterThan(key, value) {
        if (typeof key !== 'string' || typeof value === 'undefined') {
            throw new Error('Kindly pass valid key and value parameters for \'.greaterThan()\'');
        }
        else if (this.q.query && typeof this.q.query === 'object') {
            this.q.query[key] = {
                $gt: value,
            };
        }
        else {
            this.q.query = {
                [key]: {
                    $gt: value,
                },
            };
        }
        return this;
    }
    /**
     * @summary
     *  Comparison $gte query wrapper
     * @param {String} key - Field to compare against
     * @param {any} value - Value to compare with
     * @returns {this} - Returns `stack's` instance
     */
    greaterThanOrEqualTo(key, value) {
        if (typeof key !== 'string' || typeof value === 'undefined') {
            throw new Error('Kindly pass valid key and value parameters for \'.greaterThanOrEqualTo()\'');
        }
        else if (this.q.query && typeof this.q.query === 'object') {
            this.q.query[key] = {
                $gte: value,
            };
        }
        else {
            this.q.query = {
                [key]: {
                    $gte: value,
                },
            };
        }
        return this;
    }
    /**
     * @summary
     *  Comparison $ne query wrapper
     * @param {String} key - Field to compare against
     * @param {any} value - Value to compare with
     * @returns {this} - Returns `stack's` instance
     */
    notEqualTo(key, value) {
        if (typeof key !== 'string' || typeof value === 'undefined') {
            throw new Error('Kindly pass valid key and value parameters for \'.notEqualTo()\'');
        }
        else if (this.q.query && typeof this.q.query === 'object') {
            this.q.query[key] = {
                $ne: value,
            };
        }
        else {
            this.q.query = {
                [key]: {
                    $ne: value,
                },
            };
        }
        return this;
    }
    /**
     * @summary
     *  Comparison $in query wrapper
     * @param {String} key - Field to compare against
     * @param {any} value - Value to compare with
     * @returns {this} - Returns `stack's` instance
     */
    containedIn(key, value) {
        if (typeof key !== 'string' || typeof value !== 'object' || !(value instanceof Array)) {
            throw new Error('Kindly pass valid key and value parameters for \'.containedIn()\'');
        }
        else if (this.q.query && typeof this.q.query === 'object') {
            this.q.query[key] = {
                $in: value,
            };
        }
        else {
            this.q.query = {
                [key]: {
                    $in: value,
                },
            };
        }
        return this;
    }
    /**
     * @summary
     *  Comparison $nin query wrapper
     * @param {String} key - Field to compare against
     * @param {any} value - Value to compare with
     * @returns {this} - Returns `stack's` instance
     */
    notContainedIn(key, value) {
        if (typeof key !== 'string' || typeof value !== 'object' || !(value instanceof Array)) {
            throw new Error('Kindly pass valid key and value parameters for \'.notContainedIn()\'');
        }
        else if (this.q.query && typeof this.q.query === 'object') {
            this.q.query[key] = {
                $nin: value,
            };
        }
        else {
            this.q.query = {
                [key]: {
                    $nin: value,
                },
            };
        }
        return this;
    }
    /**
     * @summary
     *  Element $exists query wrapper, checks if a field exists
     * @param {String} key - Field to compare against
     * @param {any} value - Value to compare with
     * @returns {this} - Returns `stack's` instance
     */
    exists(key) {
        if (typeof key !== 'string') {
            throw new Error('Kindly pass valid key for \'.exists()\'');
        }
        else if (this.q.query && typeof this.q.query === 'object') {
            this.q.query[key] = {
                $exists: true,
            };
        }
        else {
            this.q.query = {
                [key]: {
                    $exists: true,
                },
            };
        }
        return this;
    }
    /**
     * @summary
     *  Element $exists query wrapper, checks if a field does not exists
     * @param {String} key - Field to compare against
     * @param {any} value - Value to compare with
     * @returns {this} - Returns `stack's` instance
     */
    notExists(key) {
        if (typeof key !== 'string') {
            throw new Error('Kindly pass valid key for \'.notExists()\'');
        }
        else if (this.q.query && typeof this.q.query === 'object') {
            this.q.query[key] = {
                $exists: false,
            };
        }
        else {
            this.q.query = {
                [key]: {
                    $exists: false,
                },
            };
        }
        return this;
    }
    /**
     * @summary
     *  Content type to query on
     * @param {String} uid - Content type uid
     * @returns {this} - Returns `stack's` instance
     */
    contentType(uid) {
        // create new instances, instead of re-using the old one
        const stack = new Stack(this.config, this.db);
        if (uid && typeof uid === 'string') {
            stack.q.content_type_uid = uid;
            stack.collection = stack.db.collection(stack.contentStore.collectionName);
            return stack;
        }
        throw new Error('Kindly pass the content type\'s uid');
    }
    /**
     * @summary
     *  Query for a single entry
     * @param {String} uid - Entry uid to be found, if not provided,
     *  by default returns the 1st element in the content type.
     *  Useful for `singleton` content types
     * @returns {this} - Returns `stack's` instance
     */
    entry(uid) {
        if (!(this.q.content_type_uid)) {
            throw new Error('Kindly call \'contentType()\' before \'entry()\'!');
        }
        if (uid && typeof uid === 'string') {
            this.q.uid = uid;
        }
        this.internal.limit = 1;
        this.internal.single = true;
        return this;
    }
    /**
     * @summary
     *  Query for a set of entries on a content type
     * @returns {this} - Returns `stack's` instance
     */
    entries() {
        if (this.q.content_type_uid && typeof this.q.content_type_uid === 'string') {
            return this;
        }
        throw new Error('Kindly call \'contentType()\' before \'entries()\'!');
    }
    /**
     * @summary
     *  Query for a single asset
     * @param {String} uid - Asset uid to be found, if not provided,
     *  by default returns the 1st element from assets.
     * @returns {this} - Returns `stack's` instance
     */
    asset(uid) {
        const stack = new Stack(this.config, this.db);
        if (uid && typeof uid === 'string') {
            stack.q.uid = uid;
        }
        stack.q.content_type_uid = '_assets';
        stack.collection = stack.db.collection(stack.contentStore.collectionName);
        stack.internal.limit = 1;
        stack.internal.single = true;
        return stack;
    }
    /**
     * @summary
     *  Query for a set of assets
     * @returns {this} - Returns `stack's` instance
     */
    assets() {
        const stack = new Stack(this.config, this.db);
        stack.q.content_type_uid = '_assets';
        stack.collection = stack.db.collection(stack.contentStore.collectionName);
        return stack;
    }
    /**
     * @summary
     *  Query for a single content type's schema
     * @param {String} uid - Content type uid to be found, if not provided,
     *  by default returns the 1st element from content types
     * @returns {this} - Returns `stack's` instance
     */
    schema(uid) {
        const stack = new Stack(this.config, this.db);
        if (uid && typeof uid === 'string') {
            stack.q.uid = uid;
        }
        stack.q.content_type_uid = 'contentTypes';
        stack.collection = stack.db.collection(stack.contentStore.collectionName);
        stack.internal.limit = 1;
        stack.internal.single = true;
        return stack;
    }
    /**
     * @summary
     *  Query for a set of content type schemas
     * @returns {this} - Returns `stack's` instance
     */
    schemas() {
        const stack = new Stack(this.config, this.db);
        stack.q.content_type_uid = 'contentTypes';
        stack.collection = stack.db.collection(stack.contentStore.collectionName);
        return stack;
    }
    /**
     * @summary
     *  Parameter - used to limit the total no of items returned/scanned
     *  Defaults to 100 (internally, which is overridden)
     * @param {Number} no - Max count of the 'items' returned
     * @returns {this} - Returns `stack's` instance
     */
    limit(no) {
        if (typeof no === 'number' && (no >= 0) && typeof this.q.content_type_uid === 'string') {
            this.internal.limit = no;
            return this;
        }
        throw new Error('Kindly provide a valid \'numeric\' value for \'limit()\'');
    }
    /**
     * @summary
     *  Parameter - used to skip initial no of items scanned
     *  Defaults to 0 (internally, which is overridden)
     * @param {Number} no - Min count of the 'items' to be scanned
     * @returns {this} - Returns `stack's` instance
     */
    skip(no) {
        if (typeof no === 'number' && (no >= 0) && typeof this.q.content_type_uid === 'string') {
            this.internal.skip = no;
            return this;
        }
        throw new Error('Kindly provide a valid \'numeric\' value for \'skip()\'');
    }
    /**
     * @summary
     *  Raw query filter - wrapper
     * @param {Object} queryObject - Query filter
     * @returns {this} - Returns `stack's` instance
     */
    query(queryObject = {}) {
        if (this.q.query && typeof this.q.query === 'object') {
            this.q.query = lodash_1.merge(this.q.query, queryObject);
        }
        else {
            this.q.query = queryObject;
        }
        return this;
    }
    /**
     * @summary
     *  Projections - returns only the fields passed here
     * @param {Array} fields - Array of 'fields', separated by dot ('.') notation for embedded document query
     * @returns {this} - Returns `stack's` instance
     */
    only(fields) {
        if (!fields || typeof fields !== 'object' || !(fields instanceof Array) || fields.length === 0) {
            throw new Error('Kindly provide valid \'field\' values for \'only()\'');
        }
        this.internal.only = this.internal.only || {};
        this.internal.only._id = 0;
        fields.forEach((field) => {
            if (typeof field === 'string') {
                this.internal.only[field] = 1;
            }
        });
        return this;
    }
    /**
     * @summary
     *  Projections - returns fields except the ones passed here
     * @param {Array} fields - Array of 'fields', separated by dot ('.') notation for embedded document query
     * @returns {this} - Returns `stack's` instance
     */
    except(fields) {
        if (!fields || typeof fields !== 'object' || !(fields instanceof Array) || fields.length === 0) {
            throw new Error('Kindly provide valid \'field\' values for \'except()\'');
        }
        this.internal.except = this.internal.except || {};
        fields.forEach((field) => {
            if (typeof field === 'string') {
                this.internal.except[field] = 0;
            }
        });
        this.internal.except = lodash_1.merge(this.contentStore.projections, this.internal.except);
        return this;
    }
    /**
     * @summary
     *  Raw regex to be applied on a field - wrapper
     * @param {String} field - Field on which the regex is to be applied on
     * @param {pattern} pattern - Regex pattern
     * @param {options} options - Options to be applied while evaluating the regex
     * @returns {this} - Returns `stack's` instance
     */
    regex(field, pattern, options = 'i') {
        if (!(field) || !(pattern) || typeof field !== 'string' || typeof pattern !== 'string') {
            throw new Error('Kindly provide a valid field and pattern value for \'.regex()\'');
        }
        else if (this.q.query && typeof this.q.query === 'object') {
            this.q.query = lodash_1.merge(this.q.query, {
                [field]: {
                    $options: options,
                    $regex: pattern,
                },
            });
        }
        else {
            this.q.query = {
                [field]: {
                    $options: options,
                    $regex: pattern,
                },
            };
        }
        return this;
    }
    /**
     * @summary
     *  Match entries that match a specific tags
     * @param {Array} values - Array of tag values
     * @returns {this} - Returns `stack's` instance
     */
    tags(values) {
        if (!values || typeof values !== 'object' || !(values instanceof Array) || values.length === 0) {
            throw new Error('Kindly provide valid \'field\' values for \'tags()\'');
        }
        // filter non-string keys
        lodash_1.remove(values, (value) => {
            return typeof value !== 'string';
        });
        if (this.q.query && typeof this.q.query === 'object') {
            this.q.query.tags = {
                $in: values,
            };
        }
        else {
            this.q.query = {
                tags: {
                    $in: values,
                },
            };
        }
        return this;
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
    where(expr) {
        if (!(expr)) {
            throw new Error('Kindly provide a valid field and expr/fn value for \'.where()\'');
        }
        else if (this.q.query && typeof this.q.query === 'object') {
            if (typeof expr === 'function') {
                expr = expr.toString();
            }
            this.q.query = lodash_1.merge(this.q.query, {
                $where: expr,
            });
        }
        else {
            if (typeof expr === 'function') {
                expr = expr.toString();
            }
            this.q.query = {
                $where: expr,
            };
        }
        return this;
    }
    /**
     * @summary
     *  Includes 'count' key in response, which is the total count of the items being returned
     * @returns {this} - Returns `stack's` instance
     */
    includeCount() {
        this.internal.includeCount = true;
        return this;
    }
    /**
     * @summary
     *  Includes 'content_type' key in response, which is the content type schema of the entries filtered/scanned
     * @returns {this} - Returns `stack's` instance
     */
    includeSchema() {
        this.internal.includeSchema = true;
        return this;
    }
    /**
     * @summary
     *  Includes 'content_type' key in response, which is the content type schema of the entries filtered/scanned
     * @returns {this} - Returns `stack's` instance
     */
    includeContentType() {
        this.internal.includeSchema = true;
        return this;
    }
    /**
     * @summary
     *  Includes all references of the entries being scanned
     * @returns {this} - Returns `stack's` instance
     */
    includeReferences() {
        this.internal.includeReferences = true;
        return this;
    }
    /**
     * @summary
     *  Excludes all references of the entries being scanned
     * @returns {this} - Returns `stack's` instance
     */
    excludeReferences() {
        this.internal.excludeReferences = true;
        return this;
    }
    /**
     * @summary
     *  Wrapper, that allows querying on the entry's references.
     * @note
     *  This is a slow method, since it scans all documents and fires the `reference` query on them
     *  Use `.query()` filters to reduce the total no of documents being scanned
     * @returns {this} - Returns `stack's` instance
     */
    queryReferences(query) {
        if (query && typeof query === 'object') {
            this.internal.queryReferences = query;
            return this;
        }
        throw new Error('Kindly pass a query object for \'.queryReferences()\'');
    }
    /**
     * @summary
     *  Returns the query build thusfar
     * @returns {this} - Returns `stack's` instance
     */
    getQuery() {
        return Object.assign({}, this.q);
    }
    /**
     * @summary
     *  Queries the db using the query built/passed
     * @description
     *  Does all the processing, filtering, referencing after querying the DB
     * @param {Object} query - Optional query object, that overrides all the previously build queries
     * @returns {Object} - Returns a objects, that have been processed, filtered and referenced
     */
    find(query = {}) {
        return new Promise((resolve, reject) => {
            const queryFilters = this.preProcess(query);
            if (this.internal.sort) {
                this.collection = this.collection.find(queryFilters).sort(this.internal.sort);
            }
            else {
                this.collection = this.collection.find(queryFilters);
            }
            // process it in a different manner
            if (this.internal.queryReferences) {
                return this.queryOnReferences()
                    .then(resolve)
                    .catch(reject);
            }
            return this.collection
                .project(this.internal.projections)
                .limit(this.internal.limit)
                .skip(this.internal.skip)
                .toArray()
                .then((result) => {
                let contentType;
                if (this.internal.includeSchema && this.q.content_type_uid !== 'contentTypes' && this.q.content_type_uid !==
                    '_assets') {
                    contentType = lodash_1.remove(result, { uid: this.q.content_type_uid });
                    contentType = (typeof contentType === 'object' && contentType instanceof Array && contentType.length) ?
                        contentType[0] : null;
                }
                if (this.internal.excludeReferences || this.q.content_type_uid === 'contentTypes' || this.q.content_type_uid
                    === '_assets') {
                    result = this.postProcess(result, contentType);
                    return resolve(result);
                }
                else {
                    return this.includeReferencesI(result, this.q.locale, {}, undefined)
                        .then(() => {
                        result = this.postProcess(result, contentType);
                        return resolve(result);
                    })
                        .catch((refError) => {
                        this.cleanup();
                        return reject(refError);
                    });
                }
            })
                .catch((error) => {
                this.cleanup();
                return reject(error);
            });
        });
    }
    count(query) {
        return new Promise((resolve, reject) => {
            const queryFilters = this.preProcess(query);
            this.collection = this.collection.find(queryFilters);
            // process it in a different manner
            if (this.internal.queryReferences) {
                return this.collection
                    .project(this.internal.projections)
                    .toArray()
                    .then((result) => {
                    if (result === null || result.length === 0) {
                        return resolve({ count: 0 });
                    }
                    this.internal.includeReferences = true;
                    return this.includeReferencesI(result, this.q.locale, {}, undefined)
                        .then(() => {
                        result = sift_1.default(this.internal.queryReferences, result);
                        result = result.length;
                        this.cleanup();
                        return resolve({ count: result });
                    });
                })
                    .catch((error) => {
                    this.cleanup();
                    return reject(error);
                });
            }
            return this.collection
                .project(this.internal.projections)
                .count()
                .then((result) => {
                this.cleanup();
                return resolve({ count: result });
            })
                .catch((error) => {
                this.cleanup();
                return reject(error);
            });
        });
    }
    /**
     * @summary
     *  Queries the db using the query built/passed. Returns a single entry/asset/content type object
     * @description
     *  Does all the processing, filtering, referencing after querying the DB
     * @param {Object} query - Optional query object, that overrides all the previously build queries
     * @returns {Object} - Returns an object, that has been processed, filtered and referenced
     */
    findOne(query = {}) {
        return new Promise((resolve, reject) => {
            this.internal.single = true;
            return this.find(query)
                .then(resolve)
                .catch(reject);
        });
    }
    queryOnReferences() {
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
                    result = sift_1.default(this.internal.queryReferences, result);
                    if (this.internal.skip) {
                        result = result.splice(this.internal.skip, this.internal.limit);
                    }
                    else if (this.internal.limit) {
                        result = result.splice(0, this.internal.limit);
                    }
                    result = this.postProcess(result);
                    return resolve(result);
                })
                    .catch((refError) => {
                    this.cleanup();
                    return reject(refError);
                });
            })
                .catch((error) => {
                this.cleanup();
                return reject(error);
            });
        });
    }
    /**
     * @summary
     *  Internal method, that executes and formats the queries built/passed
     * @param {Object} query - Query filter/process object
     * @returns {Object} - Returns a query object, that has been processed to be queried in mongodb
     */
    preProcess(query) {
        let queryFilters;
        if (this.q.query && typeof this.q.query === 'object') {
            this.q.query = lodash_1.merge(this.q.query, query);
        }
        else {
            this.q.query = {};
        }
        if (this.internal.only) {
            this.internal.projections = this.internal.only;
        }
        else {
            this.internal.projections = lodash_1.merge(this.contentStore.projections, this.internal.except);
        }
        if (!(this.internal.limit)) {
            this.internal.limit = this.contentStore.limit;
        }
        if (!(this.internal.skip)) {
            this.internal.skip = this.contentStore.skip;
        }
        if (!(this.q.locale)) {
            this.q.locale = this.config.locales[0].code;
        }
        if (this.q.content_type_uid === 'contentTypes') {
            delete this.q.locale;
        }
        const filters = Object.assign({ content_type_uid: this.q.content_type_uid, locale: this.q.locale }, this.q.query);
        if (this.internal.includeSchema) {
            // since, content type will take up 1 item-space
            this.internal.limit += 1;
            queryFilters = {
                $or: [
                    filters,
                    {
                        uid: this.q.content_type_uid,
                    },
                ],
            };
        }
        else {
            queryFilters = filters;
        }
        return queryFilters;
    }
    /**
     * @summary
     *  Does GC, so memory doesn't stackup
     */
    cleanup() {
        this.collection = null;
        this.internal = null;
        this.q = null;
    }
    /**
     * @summary
     *  Internal method, that executes and formats the result, which the user and use
     * @param {Object} result - Result, which's to be manipulated
     * @returns {Object} - Returns the formatted version of the `result` object
     */
    postProcess(result, contentType) {
        const count = (result === null) ? 0 : result.length;
        // if (this.internal.only) {
        //   result.forEach((item) => mask(item, this.internal.except))
        // }
        // result.forEach((item) => delete item._id)
        switch (this.q.content_type_uid) {
            case '_assets':
                if (this.internal.single) {
                    result = {
                        asset: (result === null) ? result : result[0],
                    };
                }
                else {
                    result = {
                        assets: result,
                    };
                }
                result.content_type_uid = 'assets';
                result.locale = this.q.locale;
                break;
            case 'contentTypes':
                if (this.internal.single) {
                    result = {
                        content_type: (result === null) ? result : result[0],
                    };
                }
                else {
                    result = {
                        content_types: result,
                    };
                }
                result.content_type_uid = 'content_types';
                break;
            default:
                if (this.internal.single) {
                    result = {
                        entry: (result === null) ? result : result[0],
                    };
                }
                else {
                    result = {
                        entries: result,
                    };
                }
                result.content_type_uid = this.q.content_type_uid;
                result.locale = this.q.locale;
                break;
        }
        if (this.internal.includeCount) {
            result.count = count;
        }
        if (this.internal.includeSchema) {
            result.content_type = contentType;
        }
        this.cleanup();
        return result;
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
    includeReferencesI(entry, locale, references, parentUid) {
        const self = this;
        return new Promise((resolve, reject) => {
            if (entry === null || typeof entry !== 'object') {
                return resolve();
            }
            // current entry becomes the parent
            if (entry.uid) {
                parentUid = entry.uid;
            }
            const referencesFound = [];
            // iterate over each key in the object
            for (const prop in entry) {
                if (entry[prop] !== null && typeof entry[prop] === 'object') {
                    if (entry[prop] && entry[prop].reference_to) {
                        if ((!(this.internal.includeReferences)
                            && entry[prop].reference_to === '_assets') || this.internal.includeReferences) {
                            if (entry[prop].values.length === 0) {
                                entry[prop] = [];
                            }
                            else {
                                let uids = entry[prop].values;
                                if (typeof uids === 'string') {
                                    uids = [uids];
                                }
                                if (entry[prop].reference_to !== '_assets') {
                                    uids = lodash_1.filter(uids, (uid) => {
                                        return !(util_1.checkCyclic(uid, references));
                                    });
                                }
                                if (uids.length) {
                                    const query = {
                                        content_type_uid: entry[prop].reference_to,
                                        locale,
                                        uid: {
                                            $in: uids,
                                        },
                                    };
                                    referencesFound.push(new Promise((rs, rj) => {
                                        return self.db.collection(this.contentStore.collectionName)
                                            .find(query)
                                            .project(self.config.contentStore.projections)
                                            .toArray()
                                            .then((result) => {
                                            if (result.length === 0) {
                                                entry[prop] = [];
                                                return rs();
                                            }
                                            else if (parentUid) {
                                                references[parentUid] = references[parentUid] || [];
                                                references[parentUid] = lodash_1.uniq(references[parentUid].concat(lodash_1.map(result, 'uid')));
                                            }
                                            if (typeof entry[prop].values === 'string') {
                                                entry[prop] = ((result === null) || result.length === 0) ? null : result[0];
                                            }
                                            else {
                                                // format the references in order
                                                const referenceBucket = [];
                                                query.uid.$in.forEach((entityUid) => {
                                                    const elem = lodash_1.find(result, (entity) => {
                                                        return entity.uid === entityUid;
                                                    });
                                                    if (elem) {
                                                        referenceBucket.push(elem);
                                                    }
                                                });
                                                entry[prop] = referenceBucket;
                                            }
                                            return self.includeReferencesI(entry[prop], locale, references, parentUid)
                                                .then(rs)
                                                .catch(rj);
                                        })
                                            .catch(rj);
                                    }));
                                }
                            }
                        }
                    }
                    else {
                        referencesFound.push(self.includeReferencesI(entry[prop], locale, references, parentUid));
                    }
                }
            }
            return Promise.all(referencesFound)
                .then(resolve)
                .catch(reject);
        });
    }
}
exports.Stack = Stack;
