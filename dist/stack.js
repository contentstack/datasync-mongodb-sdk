"use strict";
/*!
 * Contentstack Sync Mongodb SDK
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
class Stack {
    constructor(stackConfig, existingDB) {
        this.config = lodash_1.merge(config_1.config, stackConfig);
        this.contentStore = this.config.contentStore;
        this.types = this.contentStore.internalContentTypes;
        this.q = {};
        this.internal = {};
        this.db = existingDB;
    }
    ascending(field) {
        if (typeof this.q.content_type_uid !== 'string') {
            throw new Error('Kindly call \'.contentType()\' before \.ascending()\'');
        }
        if (!(field) || typeof field !== 'string') {
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
    close() {
        this.client.close();
    }
    language(code) {
        if (!(code) || typeof code !== 'string' || !(lodash_1.find(this.config.locales, { code }))) {
            throw new Error(`Language queried is invalid ${code}`);
        }
        this.q.locale = code;
        return this;
    }
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
    contentType(uid) {
        const stack = new Stack(this.config, this.db);
        if (uid && typeof uid === 'string') {
            stack.q.content_type_uid = uid;
            stack.collection = stack.db.collection(stack.contentStore.collectionName);
            return stack;
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
        const stack = new Stack(this.config, this.db);
        if (uid && typeof uid === 'string') {
            stack.q.uid = uid;
        }
        stack.q.content_type_uid = this.types.assets;
        stack.collection = stack.db.collection(stack.contentStore.collectionName);
        stack.internal.limit = 1;
        stack.internal.single = true;
        return stack;
    }
    assets() {
        const stack = new Stack(this.config, this.db);
        stack.q.content_type_uid = this.types.assets;
        stack.collection = stack.db.collection(stack.contentStore.collectionName);
        return stack;
    }
    schema(uid) {
        const stack = new Stack(this.config, this.db);
        if (uid && typeof uid === 'string') {
            stack.q.uid = uid;
        }
        stack.q.content_type_uid = this.types.content_types;
        stack.collection = stack.db.collection(stack.contentStore.collectionName);
        stack.internal.limit = 1;
        stack.internal.single = true;
        return stack;
    }
    schemas() {
        const stack = new Stack(this.config, this.db);
        stack.q.content_type_uid = this.types.content_types;
        stack.collection = stack.db.collection(stack.contentStore.collectionName);
        return stack;
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
        this.internal.only = this.internal.only || {};
        this.internal.only._id = 0;
        fields.forEach((field) => {
            if (typeof field === 'string') {
                this.internal.only[field] = 1;
            }
        });
        return this;
    }
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
    tags(values) {
        if (!values || typeof values !== 'object' || !(values instanceof Array) || values.length === 0) {
            throw new Error('Kindly provide valid \'field\' values for \'tags()\'');
        }
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
    includeCount() {
        this.internal.includeCount = true;
        return this;
    }
    includeSchema() {
        this.internal.includeSchema = true;
        return this;
    }
    includeContentType() {
        this.internal.includeSchema = true;
        return this;
    }
    includeReferences() {
        this.internal.includeReferences = true;
        return this;
    }
    excludeReferences() {
        this.internal.excludeReferences = true;
        return this;
    }
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
    getQuery() {
        return Object.assign({}, this.q);
    }
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
    find(query = {}) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let queryFilters = this.preProcess(query);
            let formattedQuery;
            if (this.internal.queryReferencesBeta) {
                formattedQuery = yield this.queryBuilder(this.internal.queryReferencesBeta, this.q.locale, this.q.content_type_uid);
                console.log('formatted query', JSON.stringify(formattedQuery));
            }
            queryFilters = lodash_1.merge(queryFilters, formattedQuery[0]);
            console.log('queryfilters', JSON.stringify(queryFilters));
            if (this.internal.sort) {
                this.collection = this.collection.find(queryFilters).sort(this.internal.sort);
            }
            else {
                this.collection = this.collection.find(queryFilters);
            }
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
                if (this.internal.includeSchema && this.q.content_type_uid !== this.types.content_types && this.q.content_type_uid !==
                    this.types.assets) {
                    contentType = lodash_1.remove(result, { uid: this.q.content_type_uid });
                    contentType = (typeof contentType === 'object' && contentType instanceof Array && contentType.length) ?
                        contentType[0] : null;
                }
                if (this.internal.excludeReferences || this.q.content_type_uid === this.types.content_types || this.q.content_type_uid
                    === this.types.assets) {
                    result = this.postProcess(result, contentType);
                    return resolve(result);
                }
                else if (this.internal.includeSpecificReferences) {
                    return this.includeSpecificReferences(result, this.q.locale, {}, undefined, this.internal.includeSpecificReferences)
                        .then(() => {
                        result = this.postProcess(result, contentType);
                        return resolve(result);
                    })
                        .catch((refError) => {
                        this.cleanup();
                        return reject(refError);
                    });
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
        }));
    }
    count(query) {
        return new Promise((resolve, reject) => {
            const queryFilters = this.preProcess(query);
            this.collection = this.collection.find(queryFilters);
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
                .project(this.internal.projections)
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
        if (this.q.content_type_uid === this.types.content_types) {
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
        this.internal = null;
        this.q = null;
    }
    postProcess(result, contentType) {
        const count = (result === null) ? 0 : result.length;
        switch (this.q.content_type_uid) {
            case this.types.assets:
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
            case this.types.content_types:
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
                        if ((!(this.internal.includeReferences)
                            && entry[prop].reference_to === this.types.assets) || this.internal.includeReferences) {
                            if (entry[prop].values.length === 0) {
                                entry[prop] = [];
                            }
                            else {
                                let uids = entry[prop].values;
                                if (typeof uids === 'string') {
                                    uids = [uids];
                                }
                                if (entry[prop].reference_to !== this.types.assets) {
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
    includeReferencesBeta(entry, locale, references, parentUid) {
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
                            if (entry[prop].reference_to !== this.types.assets) {
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
                                        return self.includeReferencesBeta(entry[prop], locale, references, parentUid)
                                            .then(rs)
                                            .catch(rj);
                                    })
                                        .catch(rj);
                                }));
                            }
                        }
                    }
                    else {
                        referencesFound.push(self.includeReferencesBeta(entry[prop], locale, references, parentUid));
                    }
                }
            }
            return Promise.all(referencesFound)
                .then(resolve)
                .catch(reject);
        });
    }
    isPartOfInclude(pth, include) {
        for (let i = 0, j = include.length; i < j; i++) {
            if (include[i].indexOf(pth) !== -1) {
                return true;
            }
        }
        return false;
    }
    includeSpecificReferences(entry, locale, references, parentUid, includePths = [], parentField = '') {
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
                    let currentPth;
                    if (parentField === '' && isNaN(parseInt(prop))) {
                        currentPth = prop;
                    }
                    else if (parentField === '' && !isNaN(parseInt(prop))) {
                        currentPth = parentField;
                    }
                    else {
                        currentPth = parentField.concat('.', prop);
                    }
                    if (entry[prop] && entry[prop].reference_to) {
                        if (entry[prop].reference_to === this.types.assets || this.isPartOfInclude(currentPth, includePths)) {
                            if (entry[prop].values.length === 0) {
                                entry[prop] = [];
                            }
                            else {
                                let uids = entry[prop].values;
                                if (typeof uids === 'string') {
                                    uids = [uids];
                                }
                                if (entry[prop].reference_to !== this.types.assets) {
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
                                            return self.includeSpecificReferences(entry[prop], locale, references, parentUid, includePths, currentPth)
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
                        referencesFound.push(self.includeSpecificReferences(entry[prop], locale, references, parentUid, includePths, currentPth));
                    }
                }
            }
            return Promise.all(referencesFound)
                .then(resolve)
                .catch(reject);
        });
    }
    queryBuilder(query, locale, uid) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                if (query && Object.keys(query).length && uid) {
                    return this.db.collection(this.contentStore.collectionName)
                        .find({
                        content_type_uid: this.types.content_types,
                        uid
                    })
                        .project({
                        references: 1
                    })
                        .limit(1)
                        .toArray()
                        .then((result) => {
                        console.log('result', result);
                        if (result === null || result.length === 0) {
                            return resolve(query);
                        }
                        const references = result[0].references;
                        if (references && Object.keys(references).length > 0) {
                            const promises = [];
                            for (const field in query) {
                                if (query[field] === null) {
                                    delete query[field];
                                }
                                else if (typeof query[field] === 'object' && query[field] instanceof Array && query[field].length) {
                                    promises.push(this.queryBuilder(query[field], locale, uid));
                                }
                                else {
                                    let filterField = field;
                                    let refQuery, refContentType;
                                    let refFieldM;
                                    for (let refField in references) {
                                        if (field.indexOf(refField) === 0) {
                                            refFieldM = refField;
                                            let newfilterField = filterField.replace(refField, '');
                                            if (newfilterField.charAt(0) === '.') {
                                                newfilterField = newfilterField.substr(1);
                                            }
                                            refQuery = refQuery || {};
                                            refContentType = references[refField];
                                            refQuery[newfilterField] = query[field];
                                            refQuery.content_type_uid = refContentType;
                                            refQuery.locale = locale;
                                            delete query[field];
                                        }
                                    }
                                    if (refQuery && Object.keys(refQuery).length) {
                                        promises.push(this.db.collection(this.contentStore.collectionName)
                                            .find(refQuery)
                                            .project({ uid: 1 })
                                            .toArray()
                                            .then((result) => {
                                            console.log('result', result);
                                            console.log('refQuery', refQuery);
                                            if (result === null || result.length === 0) {
                                                query[`${refFieldM}.values`] = {
                                                    $in: []
                                                };
                                            }
                                            else {
                                                console.log('filterfield> ', `${refFieldM}.values`);
                                                query[`${refFieldM}.values`] = {
                                                    $in: lodash_1.map(result, 'uid')
                                                };
                                            }
                                            return query;
                                        }));
                                    }
                                }
                            }
                            return Promise.all(promises)
                                .then(resolve)
                                .catch(reject);
                        }
                        else {
                            return resolve({});
                        }
                    })
                        .catch(reject);
                }
                else {
                    return resolve(query);
                }
            });
        });
    }
    excludeSpecificReferences(includes, uid, isOnly) {
        return new Promise((resolve) => {
            return this.db.collection(this.contentStore.collectionName)
                .find({ uid })
                .project({ references: 1 })
                .limit(1)
                .toArray()
                .then((result) => {
                if (result === null || result.length === 0) {
                    return resolve({});
                }
                const excludeQuery = {};
                const references = result[0].references;
                for (const referenceField in references) {
                    let flag = false;
                    for (let i = 0, j = includes.length; i < j; i++) {
                        if (includes[i].includes(referenceField)) {
                            flag = true;
                            break;
                        }
                    }
                    if (!flag) {
                        excludeQuery[referenceField] = (isOnly) ? 1 : 0;
                    }
                }
                return resolve(excludeQuery);
            });
        });
    }
}
exports.Stack = Stack;
