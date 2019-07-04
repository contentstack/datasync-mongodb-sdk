"use strict";
/*!
 * Contentstack DataSync Mongodb SDK
 * Copyright (c) 2019 Contentstack LLC
 * MIT Licensed
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
 * @class Stack
 * @descriptionExpose SDK query methods on Stack
 * @constructor
 * @descriptionProvides a range of connection/disconnect, filters and projections on mongodb
 * @returns {Stack} Returns an instance of `Stack`
 */
class Stack {
    constructor(stackConfig, existingDB) {
        this.config = lodash_1.merge(config_1.config, stackConfig);
        // validates config.locales property
        util_1.validateConfig(this.config);
        this.contentStore = this.config.contentStore;
        this.collectionNames = this.contentStore.collection;
        this.types = this.contentStore.internalContentTypes;
        this.q = {};
        this.internal = {};
        this.db = existingDB;
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
    descending(field) {
        if (typeof this.q.content_type_uid !== 'string') {
            throw new Error('Kindly call \'.contentType()\' before \.descending()\'');
        }
        if (!(field) || typeof field !== 'string') {
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
    connect(overrides = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbConfig = lodash_1.merge({}, this.config, overrides).contentStore;
            const uri = util_1.validateURI(dbConfig.uri || dbConfig.url);
            const options = dbConfig.options;
            const dbName = dbConfig.dbName;
            const client = new mongodb_1.MongoClient(uri, options);
            this.client = client;
            yield client.connect();
            this.db = client.db(dbName);
            return this.db;
            // // Create indexes in the background
            // const bucket: any = []
            // const indexes = this.config.contentStore.indexes
            // const collectionName = this.config.contentStore.collectionName
            // for (let index in indexes) {
            //   if (indexes[index] === 1 || indexes[index] === -1) {
            //     bucket.push(this.createIndexes(this.config.contentStore.collectionName, index, indexes[index]))
            //   }
            // }
            // Promise.all(bucket)
            //   .then(() => {
            //     console.info(`Indexes created successfully in '${collectionName}' collection`)
            //   })
            //   .catch((error) => {
            //     console.error(`Failed while creating indexes in '${collectionName}' collection`)
            //     console.error(error)
            //   })
        });
    }
    // private createIndexes(collectionId, index, type) {
    //   return this.db.collection(collectionId)
    //     .createIndex({
    //       [index]: type
    //     })
    //     .then(() => {
    //       return
    //     })
    // }
    /**
     * @public
     * @method close
     * @summary Closes connection with mongodb
     */
    close() {
        this.client.close();
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
    language(code) {
        if (!(code) || typeof code !== 'string' || !(lodash_1.find(this.config.locales, {
            code,
        }))) {
            throw new Error(`Language ${code} is invalid!`);
        }
        this.q.locale = code;
        return this;
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
    contentType(uid) {
        // create new instances, instead of re-using the old one
        const stack = new Stack(this.config, this.db);
        if (uid && typeof uid === 'string') {
            stack.q.content_type_uid = uid;
            return stack;
        }
        throw new Error('Kindly pass the content type\'s uid');
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
    entries() {
        if (this.q.content_type_uid && typeof this.q.content_type_uid === 'string') {
            return this;
        }
        throw new Error('Kindly call \'contentType()\' before \'entries()\'!');
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
    asset(uid) {
        const stack = new Stack(this.config, this.db);
        if (uid && typeof uid === 'string') {
            stack.q.uid = uid;
        }
        stack.q.content_type_uid = this.types.assets;
        // stack.collection = stack.db.collection(stack.contentStore.collectionName)
        stack.internal.limit = 1;
        stack.internal.single = true;
        return stack;
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
    assets() {
        const stack = new Stack(this.config, this.db);
        stack.q.content_type_uid = this.types.assets;
        // stack.collection = stack.db.collection(stack.contentStore.collectionName)
        return stack;
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
    schema(uid) {
        const stack = new Stack(this.config, this.db);
        if (uid && typeof uid === 'string') {
            stack.q.uid = uid;
        }
        stack.q.content_type_uid = this.types.content_types;
        // stack.collection = stack.db.collection(stack.contentStore.collectionName)
        stack.internal.limit = 1;
        stack.internal.single = true;
        return stack;
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
    schemas() {
        const stack = new Stack(this.config, this.db);
        stack.q.content_type_uid = this.types.content_types;
        // stack.collection = stack.db.collection(stack.contentStore.collectionName)
        return stack;
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
    limit(no) {
        if (typeof no === 'number' && (no >= 0) && typeof this.q.content_type_uid === 'string') {
            this.internal.limit = no;
            return this;
        }
        throw new Error('Kindly provide a valid \'numeric\' value for \'limit()\'');
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
    skip(no) {
        if (typeof no === 'number' && (no >= 0) && typeof this.q.content_type_uid === 'string') {
            this.internal.skip = no;
            return this;
        }
        throw new Error('Kindly provide a valid \'numeric\' value for \'skip()\'');
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
    includeCount() {
        this.internal.includeCount = true;
        return this;
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
    includeSchema() {
        this.internal.includeSchema = true;
        return this;
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
    includeContentType() {
        this.internal.includeSchema = true;
        return this;
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
    excludeReferences() {
        this.internal.excludeReferences = true;
        return this;
    }
    /**
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
    queryReferences(query) {
        if (query && typeof query === 'object') {
            this.internal.queryReferences = query;
            return this;
        }
        throw new Error('Kindly pass a query object for \'.queryReferences()\'');
    }
    queryReferencesBeta(query) {
        if (query && typeof query === 'object') {
            this.internal.queryReferencesBeta = query;
            return this;
        }
        throw new Error('Kindly pass a query object for \'.queryReferences()\'');
    }
    /**
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
    getQuery() {
        return Object.assign({}, this.q);
    }
    /**
     * @public
     * @method includeAllReferences
     * @description
     * This method would return all the references of your queried entries (until depth 4)
     * Note: If you wish to increase the depth of the references fetched, call .referenceDepth()
     * @example
     * Stack.contentType('blog')
     *  .entries()
     *  .includeAllReferences()
     * @returns {Stack} Returns 'this' instance (of Stack)
     */
    includeReferences() {
        this.internal.includeAllReferences = true;
        return this;
    }
    /**
     * @public
     * @method include
     * @description
     * Pass in reference field uids, that you want included in your result.
     * If you want all the references, use .includeAllReferences()
     * @example
     * Stack.contentType('blog')
     *  .entries()
     *  .include(['related_blogs', 'authors.blogs']) // here related_blogs and authors.blogs are reference field uids
     * @param {object} fields An array of reference field uids
     * @returns {Stack} Returns 'this' instance (of Stack)
     */
    include(fields) {
        if (fields.length === 0) {
            throw new Error('Kindly pass a valid reference field path to \'.include()\' ');
        }
        else if (typeof fields === 'string') {
            this.internal.includeSpecificReferences = [fields];
        }
        else {
            this.internal.includeSpecificReferences = fields;
        }
        return this;
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
    find(query = {}) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const queryFilters = this.preProcess(query);
            if (this.internal.sort) {
                this.collection = this.collection
                    .find(queryFilters)
                    .sort(this.internal.sort);
            }
            else {
                this.collection = this.collection
                    .find(queryFilters);
            }
            if (this.internal.queryReferences) {
                this.collection = this.collection
                    .project(this.internal.projections)
                    .toArray();
            }
            else {
                this.collection = this.collection
                    .project(this.internal.projections)
                    .limit(this.internal.limit)
                    .skip(this.internal.skip)
                    .toArray();
            }
            return this.collection
                .then((result) => __awaiter(this, void 0, void 0, function* () {
                // Ignore references include, for empty list, exclude call, content type & assets
                if (result.length === 0 || this.internal.excludeReferences || this.q.content_type_uid === this
                    .types.content_types || this.q.content_type_uid
                    === this.types.assets) {
                    // Do nothing
                }
                else if (this.internal.includeSpecificReferences) {
                    yield this.includeSpecificReferences(result, this.q.content_type_uid, this.q.locale, this
                        .internal.includeSpecificReferences);
                }
                else if (this.internal.includeAllReferences) {
                    yield this.bindReferences(result, this.q.content_type_uid, this.q.locale);
                }
                else {
                    yield this.includeAssetsOnly(result, this.q.content_type_uid, this.q.locale);
                }
                if (this.internal.queryReferences) {
                    result = sift_1.default(this.internal.queryReferences, result);
                    if (this.internal.skip) {
                        result = result.splice(this.internal.skip, this.internal.limit);
                    }
                    else if (this.internal.limit) {
                        result = result.splice(0, this.internal.limit);
                    }
                }
                result = yield this.postProcess(result);
                return resolve(result);
            }))
                .catch((error) => {
                this.cleanup();
                return reject(error);
            });
        }));
    }
    /**
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
    count(query) {
        return new Promise((resolve, reject) => {
            const queryFilters = this.preProcess(query);
            this.collection = this.collection.find(queryFilters);
            return this.collection
                .count()
                .then((result) => {
                this.cleanup();
                return resolve({
                    count: result,
                });
            })
                .catch((error) => {
                this.cleanup();
                return reject(error);
            });
        });
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
     *
     * @returns {object} - Returns an object, that has been processed, filtered and referenced
     */
    findOne(query = {}) {
        this.internal.single = true;
        return this.find(query);
    }
    /**
     * @private
     * @method preProcess
     * @summary Internal method, that executes and formats the queries built/passed
     * @param {object} query Query filter/process object
     * @returns {object} Returns a query object, that has been processed to be queried in mongodb
     */
    preProcess(query) {
        let queryFilters;
        if (this.q.query && typeof this.q.query === 'object') {
            this.q.query = lodash_1.merge(this.q.query, query);
        }
        else {
            this.q.query = {};
        }
        this.q.referenceDepth = this.q.referenceDepth || this.contentStore.referenceDepth;
        if (this.internal.only) {
            this.internal.projections = this.internal.only;
        }
        else {
            this.internal.projections = lodash_1.merge(this.contentStore.projections, this.internal.except);
        }
        // set default limit, if .limit() hasn't been called
        if (!(this.internal.limit)) {
            this.internal.limit = this.contentStore.limit;
        }
        // set default skip, if .skip() hasn't been called
        if (!(this.internal.skip)) {
            this.internal.skip = this.contentStore.skip;
        }
        // set default locale, if no locale has been passed
        if (!(this.q.locale)) {
            this.q.locale = this.contentStore.locale;
        }
        const filters = Object.assign({ _content_type_uid: this.q.content_type_uid, locale: this.q.locale }, this.q.query);
        if (this.q.content_type_uid === this.types.assets) {
            // since, content type will take up 1 item-space
            queryFilters = {
                $and: [
                    filters,
                    {
                        _version: {
                            $exists: true,
                        },
                    },
                ],
            };
        }
        else {
            queryFilters = filters;
        }
        this.collection = this.db.collection(util_1.getCollectionName({
            content_type_uid: this.q.content_type_uid,
            locale: this.q.locale,
        }, this.collectionNames));
        return queryFilters;
    }
    /**
     * @private
     * @method cleanup
     * @summary Does GC, so memory doesn't stackup
     */
    cleanup() {
        this.collection = null;
        this.internal = null;
        this.q = null;
    }
    /**
     * @private
     * @method postProcess
     * @summary Internal method, that executes and formats the result, which the user and use
     * @param {object} result Result, which's to be manipulated
     * @returns {object} Returns the formatted version of the `result` object
     */
    postProcess(result) {
        return __awaiter(this, void 0, void 0, function* () {
            const count = (result === null) ? 0 : result.length;
            const output = {};
            switch (this.q.content_type_uid) {
                case this.types.assets:
                    if (this.internal.single) {
                        output.asset = (result === null) ? result : result[0];
                    }
                    else {
                        output.assets = result;
                    }
                    result.content_type_uid = 'assets';
                    result.locale = this.q.locale;
                    break;
                case this.types.content_types:
                    if (this.internal.single) {
                        output.content_type = (result === null) ? result : result[0];
                    }
                    else {
                        output.content_types = result;
                    }
                    result.content_type_uid = 'content_types';
                    break;
                default:
                    if (this.internal.single) {
                        output.entry = (result === null) ? result : result[0];
                    }
                    else {
                        output.entries = result;
                    }
                    result.content_type_uid = this.q.content_type_uid;
                    result.locale = this.q.locale;
                    break;
            }
            if (this.internal.includeCount) {
                result.count = count;
            }
            if (this.internal.includeSchema) {
                result.content_type = yield this.db.collection({
                    content_type_uid: '_content_types',
                    locale: this.q.locale,
                }, this.collectionNames)
                    .findOne({
                    uid: this.q.content_type_uid,
                }, {
                    _assets: 0,
                    _content_type_uid: 0,
                    _id: 0,
                    _references: 0,
                });
            }
            this.cleanup();
            return result;
        });
    }
    includeAssetsOnly(entries, contentTypeUid, locale) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = yield this.db
                .collection(util_1.getCollectionName({
                content_type_uid: '_content_types',
                locale,
            }, this.collectionNames))
                .findOne({
                _content_type_uid: '_content_types',
                uid: contentTypeUid,
            }, {
                _assets: 1,
                _id: 0,
            });
            if (schema === null) {
                return;
            }
            const assetPaths = schema._assets;
            const paths = Object.keys(assetPaths);
            const shelf = [];
            const queryBucket = {
                $or: [],
            };
            for (let i = 0, j = paths.length; i < j; i++) {
                this.fetchPathDetails(entries, locale, paths[i].split('.'), queryBucket, shelf, true, entries, 0);
            }
            if (shelf.length === 0) {
                return;
            }
            const assets = yield this.db.collection(util_1.getCollectionName({
                content_type_uid: '_assets',
                locale,
            }, this.collectionNames))
                .find(queryBucket)
                .project({
                _content_type_uid: 0,
                _id: 0,
            })
                .toArray();
            for (let l = 0, m = shelf.length; l < m; l++) {
                for (let n = 0, o = assets.length; n < o; n++) {
                    if (shelf[l].uid === assets[n].uid) {
                        shelf[l].path[shelf[l].position] = assets[n];
                        break;
                    }
                }
            }
            return;
        });
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
    includeSpecificReferences(entries, contentTypeUid, locale, include) {
        return __awaiter(this, void 0, void 0, function* () {
            const ctQuery = {
                _content_type_uid: '_content_types',
                uid: contentTypeUid,
            };
            /**
             * key: {
             *  $in_query: {
             *    $or: [
             *      {
             *        range: { $in: [10, 100] }
             *      },
             *      {
             *        key2: {
             *          $in_query: ...
             *        }
             *      }
             *    ]
             *  }
             * }
             */
            const { paths, // ref. fields in the current content types
            pendingPath, // left over of *paths*
            schemaList, } = yield this.getReferencePath(ctQuery, locale, include);
            // console.log('paths: ' + paths)
            // console.log('pending paths: ' + pendingPath)
            // console.log('schema list: ' + JSON.stringify(schemaList))
            const queries = {
                $or: [],
            }; // reference field paths
            const shelf = []; // a mapper object, that holds pointer to the original element
            // iterate over each path in the entries and fetch the references
            // while fetching, keep track of their location
            for (let i = 0, j = paths.length; i < j; i++) {
                this.fetchPathDetails(entries, locale, paths[i].split('.'), queries, shelf, true, entries, 0);
            }
            // console.log('@sub queries', queries)
            // console.log('@shelf', JSON.stringify(shelf))
            // even after traversing, if no references were found, simply return the entries found thusfar
            if (shelf.length === 0) {
                return entries;
            }
            // console.log('@shelf-1', JSON.stringify(shelf))
            // else, self-recursively iterate and fetch references
            // Note: Shelf is the one holding `pointers` to the actual entry
            // Once the pointer has been used, for GC, point the object to null
            return this.includeReferenceIteration(queries, schemaList, locale, pendingPath, shelf);
        });
    }
    fetchPathDetails(data, locale, pathArr, queryBucket, shelf, assetsOnly = false, parent, pos, counter = 0) {
        if (counter === (pathArr.length)) {
            // console.log('data', data)
            // console.log('parent', parent)
            if (data && typeof data === 'object') {
                // console.log('data is object')
                if (data instanceof Array && data.length) {
                    // console.log('data is array')
                    data.forEach((elem, idx) => {
                        // console.log('elem', elem)
                        if (typeof elem === 'string') {
                            queryBucket.$or.push({
                                _content_type_uid: '_assets',
                                locale,
                                uid: elem,
                            });
                            shelf.push({
                                path: data,
                                position: idx,
                                uid: elem,
                            });
                        }
                        else if (elem && typeof elem === 'object' && elem.hasOwnProperty('_content_type_uid')) {
                            queryBucket.$or.push({
                                _content_type_uid: elem._content_type_uid,
                                locale,
                                uid: elem.uid,
                            });
                            shelf.push({
                                path: data,
                                position: idx,
                                uid: elem.uid,
                            });
                        }
                    });
                }
                else if (typeof data === 'object') {
                    // console.log('data is plain object')
                    if (data.hasOwnProperty('_content_type_uid')) {
                        queryBucket.$or.push({
                            _content_type_uid: data._content_type_uid,
                            locale,
                            uid: data.uid,
                        });
                        shelf.push({
                            path: parent,
                            position: pos,
                            uid: data.uid,
                        });
                    }
                }
            }
            else if (typeof data === 'string') {
                // console.log('data is string')
                queryBucket.$or.push({
                    _content_type_uid: '_assets',
                    locale,
                    uid: data,
                });
                // console.log('shelf for assets: ' + JSON.stringify(parent), pos)
                shelf.push({
                    path: parent,
                    position: pos,
                    uid: data,
                });
            }
        }
        else {
            const currentField = pathArr[counter];
            // console.log('path not over. current field is', currentField)
            counter++;
            if (data instanceof Array) {
                // tslint:disable-next-line: prefer-for-of
                for (let i = 0; i < data.length; i++) {
                    if (data[i][currentField]) {
                        // console.log('data was array, lookin for field in data.current field')
                        this.fetchPathDetails(data[i][currentField], locale, pathArr, queryBucket, shelf, assetsOnly, data[i], currentField, counter);
                    }
                }
            }
            else {
                if (data[currentField]) {
                    // console.log('data was object, lookin for field in data.current field')
                    this.fetchPathDetails(data[currentField], locale, pathArr, queryBucket, shelf, assetsOnly, data, currentField, counter);
                }
            }
        }
        // since we've reached last of the paths, return!
        return;
    }
    includeReferenceIteration(eQuery, ctQuery, locale, include, oldShelf) {
        return __awaiter(this, void 0, void 0, function* () {
            if (oldShelf.length === 0 || ctQuery.$or.length === 0) {
                return;
            }
            const { paths, pendingPath, schemaList, } = yield this.getReferencePath(ctQuery, locale, include);
            // console.log('@paths 2', JSON.stringify(paths))
            // console.log('@pending path', pendingPath)
            // console.log('@schema list 2', JSON.stringify(schemaList))
            const { result, queries, shelf, } = yield this.fetchEntries(eQuery, locale, paths, include);
            // GC to avoid mem leaks!
            // eQuery = null
            // console.log('@entries 2', JSON.stringify(result))
            // console.log('@queries 2', queries)
            // console.log('@shelf-2', JSON.stringify(shelf))
            for (let i = 0, j = oldShelf.length; i < j; i++) {
                const element = oldShelf[i];
                for (let k = 0, l = result.length; k < l; k++) {
                    if (result[k].uid === element.uid) {
                        element.path[element.position] = result[k];
                        break;
                    }
                }
            }
            // GC to avoid mem leaks!
            oldShelf = null;
            // Iterative loops, that traverses paths and binds them onto entries
            yield this.includeReferenceIteration(queries, schemaList, locale, pendingPath, shelf);
            return;
        });
    }
    getReferencePath(query, locale, currentInclude) {
        return __awaiter(this, void 0, void 0, function* () {
            const schemas = yield this.db.collection(util_1.getCollectionName({
                content_type_uid: '_content_types',
                locale,
            }, this.collectionNames))
                .find(query)
                .project({
                _assets: 1,
                _id: 0,
                _references: 1,
            })
                .toArray();
            const pendingPath = [];
            const schemasReferred = [];
            const paths = [];
            const schemaList = {
                $or: [],
            };
            if (schemas.length === 0) {
                return {
                    paths,
                    pendingPath,
                    schemaList,
                };
            }
            let entryReferences = {};
            schemas.forEach((schema) => {
                // Entry references
                entryReferences = lodash_1.merge(entryReferences, schema._references);
                // tslint:disable-next-line: forin
                for (const path in schema._assets) {
                    paths.push(path);
                }
            });
            for (let i = 0, j = currentInclude.length; i < j; i++) {
                const includePath = currentInclude[i];
                // tslint:disable-next-line: forin
                for (const path in entryReferences) {
                    const idx = includePath.indexOf(path);
                    if (~idx) {
                        let subPath;
                        // console.log('path vs includePath', path, includePath)
                        // Its the complete path!! Hurrah!
                        if (path.length !== includePath.length) {
                            subPath = includePath.slice(0, path.length);
                            pendingPath.push(includePath.slice(path.length + 1));
                        }
                        else {
                            subPath = includePath;
                        }
                        if (typeof entryReferences[path] === 'string') {
                            schemasReferred.push({
                                _content_type_uid: '_content_types',
                                uid: entryReferences[path],
                            });
                        }
                        else {
                            entryReferences[path].forEach((contentTypeUid) => {
                                schemasReferred.push({
                                    _content_type_uid: '_content_types',
                                    uid: contentTypeUid,
                                });
                            });
                        }
                        paths.push(subPath);
                        break;
                    }
                }
            }
            schemaList.$or = schemasReferred;
            return {
                // path, that's possible in the current schema
                paths,
                // paths, that's yet to be traversed
                pendingPath,
                // schemas, to be loaded!
                schemaList,
            };
        });
    }
    fetchEntries(query, locale, paths, include, includeAll = false) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('@fetch entries query', JSON.stringify(query))
            const result = yield this.db.collection(util_1.getCollectionName({
                content_type_uid: 'entries',
                locale,
            }, this.collectionNames))
                .find(query)
                .project({
                _content_type_uid: 0,
                _id: 0,
                _synced_at: 0,
                event_at: 0,
            })
                .toArray();
            const queries = {
                $or: [],
            };
            const shelf = [];
            if (result.length === 0) {
                return {
                    queries,
                    result,
                    shelf,
                };
            }
            if (include.length || includeAll) {
                paths.forEach((path) => {
                    this.fetchPathDetails(result, locale, path.split('.'), queries, shelf, false, result, 0);
                });
            }
            else {
                // if there are no includes, only fetch assets)
                paths.forEach((path) => {
                    this.fetchPathDetails(result, locale, path.split('.'), queries, shelf, true, result, 0);
                });
            }
            return {
                queries,
                result,
                shelf,
            };
        });
    }
    bindReferences(entries, contentTypeUid, locale) {
        return __awaiter(this, void 0, void 0, function* () {
            const ctQuery = {
                $or: [{
                        _content_type_uid: '_content_types',
                        uid: contentTypeUid,
                    }],
            };
            const { paths, // ref. fields in the current content types
            ctQueries, } = yield this.getAllReferencePaths(ctQuery, locale);
            // console.log('paths: ' + paths)
            // console.log('schema list: ' + JSON.stringify(schemaList))
            const queries = {
                $or: [],
            }; // reference field paths
            const objectPointerList = []; // a mapper object, that holds pointer to the original element
            // iterate over each path in the entries and fetch the references
            // while fetching, keep track of their location
            for (let i = 0, j = paths.length; i < j; i++) {
                this.fetchPathDetails(entries, locale, paths[i].split('.'), queries, objectPointerList, true, entries, 0);
            }
            // console.log('@sub queries', queries)
            // console.log('@objectPointerList', JSON.stringify(objectPointerList))
            // even after traversing, if no references were found, simply return the entries found thusfar
            if (objectPointerList.length === 0) {
                return entries;
            }
            // console.log('@shelf-1', JSON.stringify(shelf))
            // else, self-recursively iterate and fetch references
            // Note: Shelf is the one holding `pointers` to the actual entry
            // Once the pointer has been used, for GC, point the object to null
            return this.includeAllReferencesIteration(queries, ctQueries, locale, objectPointerList);
        });
    }
    includeAllReferencesIteration(oldEntryQueries, oldCtQueries, locale, oldObjectPointerList, depth = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            if (depth > this.q.referenceDepth || oldObjectPointerList.length === 0 || oldCtQueries.$or.length === 0) {
                return;
            }
            const { ctQueries, paths, } = yield this.getAllReferencePaths(oldCtQueries, locale);
            // console.log('@paths', paths)
            // GC to aviod mem leaks
            oldCtQueries = null;
            const { result, queries, shelf, } = yield this.fetchEntries(oldEntryQueries, locale, paths, [], true);
            // GC to avoid mem leaks!
            oldEntryQueries = null;
            for (let i = 0, j = oldObjectPointerList.length; i < j; i++) {
                const element = oldObjectPointerList[i];
                for (let k = 0, l = result.length; k < l; k++) {
                    if (result[k].uid === element.uid) {
                        element.path[element.position] = result[k];
                        break;
                    }
                }
            }
            // GC to avoid mem leaks!
            oldObjectPointerList = null;
            ++depth;
            // Iterative loops, that traverses paths and binds them onto entries
            yield this.includeAllReferencesIteration(queries, ctQueries, locale, shelf, depth);
            return;
        });
    }
    getAllReferencePaths(contentTypeQueries, locale) {
        return __awaiter(this, void 0, void 0, function* () {
            const contents = yield this.db
                .collection(util_1.getCollectionName({
                content_type_uid: '_content_types',
                locale,
            }, this.collectionNames))
                .find(contentTypeQueries)
                .project({
                _assets: 1,
                _references: 1,
            })
                .toArray();
            const ctQueries = {
                $or: [],
            };
            let paths = [];
            for (let i = 0, j = contents.length; i < j; i++) {
                // console.log('_assets', contents[i]._assets)
                // console.log('references', contents[i]._references)
                let assetFieldPaths;
                let entryReferencePaths;
                if (contents[i].hasOwnProperty('_assets')) {
                    assetFieldPaths = Object.keys(contents[i]._assets);
                    paths = paths.concat(assetFieldPaths);
                }
                if (contents[i].hasOwnProperty('_references')) {
                    entryReferencePaths = Object.keys(contents[i]._references);
                    paths = paths.concat(entryReferencePaths);
                    for (let k = 0, l = entryReferencePaths.length; k < l; k++) {
                        if (typeof contents[i]._references[entryReferencePaths[k]] === 'string') {
                            ctQueries.$or.push({
                                _content_type_uid: '_content_types',
                                // this would probably make it slow in FS, avoid this there?
                                // locale,
                                uid: contents[i]._references[entryReferencePaths[k]],
                            });
                        }
                        else if (contents[i]._references[entryReferencePaths[k]].length) {
                            contents[i]._references[entryReferencePaths[k]].forEach((uid) => {
                                ctQueries.$or.push({
                                    _content_type_uid: '_content_types',
                                    // avoiding locale here, not sure if its required
                                    // locale,
                                    uid,
                                });
                            });
                        }
                    }
                }
            }
            // console.log('@paths later..', JSON.stringify(paths))
            // console.log('@ctQueries later..', JSON.stringify(ctQueries))
            return {
                ctQueries,
                paths,
            };
        });
    }
}
exports.Stack = Stack;
