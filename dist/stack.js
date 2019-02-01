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
const debug_1 = __importDefault(require("debug"));
const lodash_1 = require("lodash");
const mongodb_1 = require("mongodb");
const config_1 = require("./config");
const util_1 = require("./util");
const debug = debug_1.default('stack');
class Stack {
    constructor(...stackInfo) {
        this.config = lodash_1.merge(config_1.config, ...stackInfo);
        this.q = {};
        this.q = {};
        this.internal = {};
    }
    ascending(field) {
        if (!(field) || typeof field !== 'string') {
            throw new Error('Kindly provide a valid field name for \'.ascending()\'');
        }
        field = util_1.append(field);
        this.internal.sort = {
            [field]: 1,
        };
        return this;
    }
    descending(field) {
        if (!(field) || typeof field !== 'string') {
            throw new Error('Kindly provide a valid field name for \'.descending()\'');
        }
        field = util_1.append(field);
        this.internal.sort = {
            [field]: -1,
        };
        return this;
    }
    connect(overrides = {}) {
        return new Promise((resolve, reject) => {
            try {
                const dbConfig = lodash_1.merge({}, this.config, overrides);
                const uri = util_1.validateURI(dbConfig.uri || dbConfig.url);
                const options = dbConfig.options;
                const dbName = dbConfig.dbName;
                const client = new mongodb_1.MongoClient(uri, options);
                this.client = client;
                return client.connect().then(() => {
                    this.db = client.db(dbName);
                    debug('Db connection set successfully!');
                    return resolve(this.db);
                }).catch(reject);
            }
            catch (error) {
                return reject(error);
            }
        });
    }
    close() {
        debug('Closing db connection!');
        this.client.close();
    }
    language(code) {
        if (!(code) || typeof code !== 'string' || !(lodash_1.find(this.config.locales, { code }))) {
            throw new Error(`Language queried is invalid ${code}`);
        }
        this.q.locale = code;
        return this;
    }
    and(...queries) {
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
    or(...queries) {
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
    lessThan(key, value) {
        if (typeof key !== 'string' || typeof value === 'undefined') {
            throw new Error('Kindly pass valid key and value parameters for \'.lessThan()\'');
        }
        else if (this.q.query && typeof this.q.query === 'object') {
            key = util_1.append(key);
            this.q.query[key] = {
                $lt: value,
            };
        }
        else {
            key = util_1.append(key);
            this.q.query = {
                [key]: {
                    $lt: value,
                },
            };
        }
        return this;
    }
    lessThanOrEqualTo(key, value) {
        if (typeof key !== 'string' || typeof value === 'undefined') {
            throw new Error('Kindly pass valid key and value parameters for \'.lessThanOrEqualTo()\'');
        }
        else if (this.q.query && typeof this.q.query === 'object') {
            key = util_1.append(key);
            this.q.query[key] = {
                $lte: value,
            };
        }
        else {
            key = util_1.append(key);
            this.q.query = {
                [key]: {
                    $lte: value,
                },
            };
        }
        return this;
    }
    greaterThan(key, value) {
        if (typeof key !== 'string' || typeof value === 'undefined') {
            throw new Error('Kindly pass valid key and value parameters for \'.greaterThan()\'');
        }
        else if (this.q.query && typeof this.q.query === 'object') {
            key = util_1.append(key);
            this.q.query[key] = {
                $gt: value,
            };
        }
        else {
            key = util_1.append(key);
            this.q.query = {
                [key]: {
                    $gt: value,
                },
            };
        }
        return this;
    }
    greaterThanOrEqualTo(key, value) {
        if (typeof key !== 'string' || typeof value === 'undefined') {
            throw new Error('Kindly pass valid key and value parameters for \'.greaterThanOrEqualTo()\'');
        }
        else if (this.q.query && typeof this.q.query === 'object') {
            key = util_1.append(key);
            this.q.query[key] = {
                $gte: value,
            };
        }
        else {
            key = util_1.append(key);
            this.q.query = {
                [key]: {
                    $gte: value,
                },
            };
        }
        return this;
    }
    notEqualTo(key, value) {
        if (typeof key !== 'string' || typeof value === 'undefined') {
            throw new Error('Kindly pass valid key and value parameters for \'.notEqualTo()\'');
        }
        else if (this.q.query && typeof this.q.query === 'object') {
            key = util_1.append(key);
            this.q.query[key] = {
                $ne: value,
            };
        }
        else {
            key = util_1.append(key);
            this.q.query = {
                [key]: {
                    $ne: value,
                },
            };
        }
        return this;
    }
    containedIn(key, value) {
        if (typeof key !== 'string' || typeof value !== 'object' || !(value instanceof Array)) {
            throw new Error('Kindly pass valid key and value parameters for \'.containedIn()\'');
        }
        else if (this.q.query && typeof this.q.query === 'object') {
            key = util_1.append(key);
            this.q.query[key] = {
                $in: value,
            };
        }
        else {
            key = util_1.append(key);
            this.q.query = {
                [key]: {
                    $in: value,
                },
            };
        }
        return this;
    }
    notContainedIn(key, value) {
        if (typeof key !== 'string' || typeof value !== 'object' || !(value instanceof Array)) {
            throw new Error('Kindly pass valid key and value parameters for \'.notContainedIn()\'');
        }
        else if (this.q.query && typeof this.q.query === 'object') {
            key = util_1.append(key);
            this.q.query[key] = {
                $nin: value,
            };
        }
        else {
            key = util_1.append(key);
            this.q.query = {
                [key]: {
                    $nin: value,
                },
            };
        }
        return this;
    }
    exists(key) {
        if (typeof key !== 'string') {
            throw new Error('Kindly pass valid key for \'.exists()\'');
        }
        else if (this.q.query && typeof this.q.query === 'object') {
            key = util_1.append(key);
            this.q.query[key] = {
                $exists: true,
            };
        }
        else {
            key = util_1.append(key);
            this.q.query = {
                [key]: {
                    $exists: true,
                },
            };
        }
        return this;
    }
    notExists(key) {
        if (typeof key !== 'string') {
            throw new Error('Kindly pass valid key for \'.notExists()\'');
        }
        else if (this.q.query && typeof this.q.query === 'object') {
            key = util_1.append(key);
            this.q.query[key] = {
                $exists: false,
            };
        }
        else {
            key = util_1.append(key);
            this.q.query = {
                [key]: {
                    $exists: false,
                },
            };
        }
        return this;
    }
    contentType(uid) {
        if (uid && typeof uid === 'string') {
            this.q.content_type_uid = uid;
            this.collection = this.db.collection(this.config.collectionName);
            return this;
        }
        throw new Error('Kindly pass the content type\'s uid');
    }
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
    entries() {
        if (this.q.content_type_uid && typeof this.q.content_type_uid === 'string') {
            return this;
        }
        throw new Error('Kindly call \'contentType()\' before \'entries()\'!');
    }
    asset(uid) {
        if (uid && typeof uid === 'string') {
            this.q.content_type_uid = '_assets';
            this.q.uid = uid;
        }
        this.collection = this.db.collection(this.config.collectionName);
        this.internal.limit = 1;
        this.internal.single = true;
        return this;
    }
    assets() {
        this.q.content_type_uid = '_assets';
        this.collection = this.db.collection(this.config.collectionName);
        return this;
    }
    schema(uid) {
        if (uid && typeof uid === 'string') {
            this.q.content_type_uid = 'contentTypes';
            this.q.uid = uid;
        }
        this.collection = this.db.collection(this.config.collectionName);
        this.internal.limit = 1;
        this.internal.single = true;
        return this;
    }
    schemas() {
        this.q.content_type_uid = 'contentTypes';
        this.collection = this.db.collection(this.config.collectionName);
        return this;
    }
    limit(no) {
        if (typeof no === 'number' && (no >= 0) && typeof this.q.content_type_uid === 'string') {
            this.internal.limit = no;
            return this;
        }
        throw new Error('Kindly provide a valid \'numeric\' value for \'limit()\'');
    }
    skip(no) {
        if (typeof no === 'number' && (no >= 0) && typeof this.q.content_type_uid === 'string') {
            this.internal.skip = no;
            return this;
        }
        throw new Error('Kindly provide a valid \'numeric\' value for \'skip()\'');
    }
    query(queryObject = {}) {
        if (this.q.query && typeof this.q.query === 'object') {
            this.q.query = lodash_1.merge(this.q.query, queryObject);
        }
        else {
            this.q.query = queryObject;
        }
        return this;
    }
    only(fields) {
        if (!fields || typeof fields !== 'object' || !(fields instanceof Array) || fields.length === 0) {
            throw new Error('Kindly provide valid \'field\' values for \'only()\'');
        }
        this.internal.projections = this.internal.projections || {};
        fields.forEach((field) => {
            if (typeof field === 'string') {
                field = util_1.append(field);
                this.internal.projections[field] = 1;
            }
            else {
                debug(`.only(): ${field} is not of type string!`);
            }
        });
        return this;
    }
    except(fields) {
        if (!fields || typeof fields !== 'object' || !(fields instanceof Array) || fields.length === 0) {
            throw new Error('Kindly provide valid \'field\' values for \'except()\'');
        }
        this.internal.projections = this.internal.projections || {};
        fields.forEach((field) => {
            if (typeof field === 'string') {
                field = util_1.append(field);
                this.internal.projections[field] = 0;
            }
            else {
                debug(`.except(): ${field} is not of type string!`);
            }
        });
        return this;
    }
    regex(field, pattern, options = 'g') {
        if (!(field) || !(pattern) || typeof field !== 'string' || typeof pattern !== 'string') {
            throw new Error('Kindly provide a valid field and pattern value for \'.regex()\'');
        }
        else if (this.q.query && typeof this.q.query === 'object') {
            field = util_1.append(field);
            this.q.query = lodash_1.merge(this.q.query, {
                [field]: {
                    $options: options,
                    $regex: pattern,
                },
            });
        }
        else {
            field = util_1.append(field);
            this.q.query = {
                [field]: {
                    $options: options,
                    $regex: pattern,
                },
            };
        }
        return this;
    }
    tags(values) {
        if (!values || typeof values !== 'object' || !(values instanceof Array) || values.length === 0) {
            throw new Error('Kindly provide valid \'field\' values for \'tags()\'');
        }
        lodash_1.remove(values, (value) => {
            return typeof value !== 'string';
        });
        if (this.q.query && typeof this.q.query === 'object') {
            this.q.query['data.tags'] = {
                $in: values,
            };
        }
        else {
            this.q.query = {
                'data.tags': {
                    $in: values,
                },
            };
        }
        return this;
    }
    where(...expr) {
        if (!(expr)) {
            throw new Error('Kindly provide a valid field and expr/fn value for \'.where()\'');
        }
        else if (this.q.query && typeof this.q.query === 'object') {
            this.q.query = lodash_1.merge(this.q.query, {
                $where: expr,
            });
        }
        else {
            this.q.query.$where = expr;
        }
        return this;
    }
    count() {
        this.collection = this.collection.count();
        return this;
    }
    includeCount() {
        this.internal.includeCount = true;
        return this;
    }
    includeSchema() {
        this.internal.includeSchema = true;
        return this;
    }
    includeReferences() {
        this.internal.includeReferences = true;
        return this;
    }
    getQuery() {
        return Object.assign({}, this.q);
    }
    find(query = {}) {
        return new Promise((resolve, reject) => {
            const queryFilters = this.preProcess(query);
            console.log('find() query: ' + JSON.stringify(queryFilters, null, 1));
            return this.collection
                .find(queryFilters)
                .project(this.internal.projections)
                .limit(this.internal.limit)
                .skip(this.internal.skip)
                .toArray()
                .then((result) => {
                if (this.internal.includeReferences) {
                    result = lodash_1.map(result, 'data');
                    return this.includeReferencesI(result, this.q.locale, {}, undefined)
                        .then(() => {
                        result = this.postProcess(result);
                        return resolve(result);
                    })
                        .catch((refError) => {
                        this.cleanup();
                        return reject(refError);
                    });
                }
                else {
                    result = lodash_1.map(result, 'data');
                    result = this.postProcess(result);
                    return resolve(result);
                }
            })
                .catch((error) => {
                this.cleanup();
                return reject(error);
            });
        });
    }
    findOne(query = {}) {
        return new Promise((resolve, reject) => {
            this.internal.single = true;
            const queryFilters = this.preProcess(query);
            console.log('findOne query: ' + JSON.stringify(queryFilters, null, 1));
            return this.collection
                .find(queryFilters)
                .project(this.internal.projections)
                .limit(this.internal.limit)
                .skip(this.internal.skip)
                .toArray()
                .then((result) => {
                if (this.internal.includeReferences) {
                    result = lodash_1.map(result, 'data');
                    return this.includeReferencesI(result, this.q.locale, {})
                        .then(() => {
                        result = this.postProcess(result);
                        return resolve(result);
                    })
                        .catch((refError) => {
                        this.cleanup();
                        return reject(refError);
                    });
                }
                else {
                    result = lodash_1.map(result, 'data');
                    result = this.postProcess(result);
                    return resolve(result);
                }
            })
                .catch((error) => {
                this.cleanup();
                return reject(error);
            });
        });
    }
    preProcess(query) {
        let queryFilters;
        if (this.q.query && typeof this.q.query === 'object') {
            this.q.query = lodash_1.merge(this.q.query, query);
        }
        else {
            this.q.query = {};
        }
        if (this.internal.projections) {
            this.internal.projections = lodash_1.merge(this.config.projections, this.internal.projections);
        }
        else {
            this.internal.projections = this.config.projections;
        }
        if (!(this.internal.limit)) {
            this.internal.limit = this.config.limit;
        }
        if (!(this.internal.skip)) {
            this.internal.skip = this.config.skip;
        }
        if (!(this.q.locale)) {
            this.q.locale = this.config.locales[0].code;
        }
        if (this.q.content_type_uid === 'contentTypes') {
            debug('Removing \'locale\' filter, since the query is on content types');
            delete this.q.locale;
        }
        const filters = Object.assign({ content_type_uid: this.q.content_type_uid, locale: this.q.locale }, this.q.query);
        if (this.internal.includeSchema) {
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
    cleanup() {
        this.collection = null;
        this.internal = {};
        this.q = {};
    }
    postProcess(result) {
        let contentType;
        if (this.internal.includeSchema) {
            contentType = lodash_1.remove(result, { uid: this.q.content_type_uid });
            contentType = (typeof contentType === 'object' && contentType instanceof Array && contentType.length) ?
                contentType[0] : null;
        }
        const count = (result === null) ? 0 : result.length;
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
                break;
        }
        if (this.internal.includeCount) {
            result.count = count;
        }
        if (this.q.content_type_uid === '_assets') {
            this.q.content_type_uid = 'assets';
        }
        if (this.internal.includeSchema) {
            result.content_type = contentType;
        }
        result.content_type_uid = this.q.content_type_uid;
        result.locale = this.q.locale;
        this.cleanup();
        return result;
    }
    includeReferencesI(entry, locale, references, parentUid) {
        const self = this;
        return new Promise((resolve, reject) => {
            if (entry === null || typeof entry !== 'object') {
                return resolve();
            }
            if (entry.uid) {
                parentUid = entry.uid;
            }
            const referencesFound = [];
            for (const prop in entry) {
                if (entry[prop] !== null && typeof entry[prop] === 'object') {
                    if (entry[prop] && entry[prop].reference_to) {
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
                                    return self.db.collection('contents')
                                        .find(query)
                                        .project(self.config.projections)
                                        .toArray()
                                        .then((result) => {
                                        const entities = lodash_1.map(result, 'data');
                                        if (entities.length === 0) {
                                            entry[prop] = [];
                                            return rs();
                                        }
                                        else if (parentUid) {
                                            references[parentUid] = references[parentUid] || [];
                                            references[parentUid] = lodash_1.uniq(references[parentUid].concat(lodash_1.map(entry[prop], 'uid')));
                                        }
                                        const referenceBucket = [];
                                        query.uid.$in.forEach((entityUid) => {
                                            const elem = lodash_1.find(entities, (entity) => {
                                                return entity.uid === entityUid;
                                            });
                                            if (elem) {
                                                referenceBucket.push(elem);
                                            }
                                        });
                                        entry[prop] = entities;
                                        return self.includeReferencesI(entry[prop], locale, references, parentUid)
                                            .then(rs)
                                            .catch(rj);
                                    })
                                        .catch(rj);
                                }));
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
