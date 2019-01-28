"use strict";
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
    constructor(...stack_arguments) {
        this.config = lodash_1.merge(config_1.config, ...stack_arguments);
        this._query = {};
        this.internal = {};
        this.db;
        this.client;
    }
    ascending(field) {
        if (!(field) || typeof field !== 'string') {
            throw new Error('Kindly provide a valid field name for \'.ascending()\'');
        }
        this.internal.sort = {
            [field]: 1
        };
        return this;
    }
    descending(field) {
        if (!(field) || typeof field !== 'string') {
            throw new Error('Kindly provide a valid field name for \'.descending()\'');
        }
        this.internal.sort = {
            [field]: -1
        };
        return this;
    }
    connect(overrides = {}) {
        return new Promise((resolve, reject) => {
            try {
                const config = lodash_1.merge({}, this.config, overrides);
                const uri = util_1.validateURI(config.uri || config.url);
                const options = config.options;
                const dbName = config.dbName;
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
    contentType(uid) {
        if (uid && typeof uid === 'string') {
            this._query.content_type_uid = uid;
            this.collection = this.db.collection(this.config.collectionName);
            return this;
        }
        throw new Error('Kindly pass the content type\'s uid');
    }
    entry(uid) {
        if (!(this._query.content_type_uid)) {
            throw new Error('Kindly call \'contentType()\' before \'entry()\'!');
        }
        if (uid && typeof uid === 'string') {
            this._query.uid = uid;
        }
        this.collection = this.collection.limit(1);
        this.internal.single = true;
        return this;
    }
    entries() {
        if (this._query.content_type_uid && typeof this._query.content_type_uid === 'string') {
            return this;
        }
        throw new Error('Kindly call \'contentType()\' before \'entries()\'!');
    }
    asset(uid) {
        if (uid && typeof uid === 'string') {
            this._query.content_type_uid = '_assets';
            this._query.uid = uid;
        }
        this.collection = this.db.collection(this.config.collectionName);
        this.collection = this.collection.limit(1);
        this.internal.single = true;
        return this;
    }
    assets() {
        this._query.content_type_uid = '_assets';
        this.collection = this.db.collection(this.config.collectionName);
        return this;
    }
    limit(no) {
        if (typeof no === 'number' && (no >= 0) && typeof this._query.content_type_uid === 'string') {
            this.internal.limit = no;
            return this;
        }
        throw new Error('Kindly provide a valid \'numeric\' value for \'limit()\'');
    }
    skip(no) {
        if (typeof no === 'number' && (no >= 0) && typeof this._query.content_type_uid === 'string') {
            this.internal.skip = no;
            return this;
        }
        throw new Error('Kindly provide a valid \'numeric\' value for \'skip()\'');
    }
    query(queryObject = {}) {
        if (this._query.query && typeof this._query.query === 'object') {
            this._query.query = lodash_1.merge(this._query.query, queryObject);
        }
        else {
            this._query.query = queryObject;
        }
        return this;
    }
    only(fields) {
        if (!fields || typeof fields !== 'object' || !(fields instanceof Array) || fields.length === 0) {
            throw new Error('Kindly provide valid \'field\' values for \'only()\'');
        }
        this.internal.projections = this.internal.projections || {};
        fields.forEach(field => {
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
        fields.forEach(field => {
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
    tags(values) {
        if (!values || typeof values !== 'object' || !(values instanceof Array) || values.length === 0) {
            throw new Error('Kindly provide valid \'field\' values for \'tags()\'');
        }
        lodash_1.remove(values, (value) => {
            return typeof value !== 'string';
        });
        this._query.data = this._query.data || {};
        this._query.data.tags = {
            $in: values
        };
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
    preProcess(query) {
        if (this._query.query && typeof this._query.query === 'object') {
            this._query.query = lodash_1.merge(this._query.query, query);
            this._query.query = {
                data: this._query.query
            };
        }
        else {
            this._query.query = {};
        }
        if (this.internal.projections) {
            this.internal.projections._id = 0;
        }
        else {
            this.internal.projections = {
                '_id': 0
            };
        }
        if (!(this.internal.limit)) {
            this.internal.limit = this.config.limit;
        }
        if (!(this.internal.skip)) {
            this.internal.skip = this.config.skip;
        }
        if (!(this._query.locale)) {
            this._query.locale = this.config.locales[0].code;
        }
    }
    postProcess(result) {
        result = lodash_1.map(result, 'data');
        const count = (result === null) ? 0 : result.length;
        switch (this._query.content_type_uid) {
            case '_assets':
                if (this.internal.limit === 1) {
                    result = {
                        asset: (result === null) ? result : result[0]
                    };
                }
                else {
                    result = {
                        assets: result
                    };
                }
                break;
            case 'contentTypes':
                if (this.internal.limit === 1) {
                    result = {
                        content_type: (result === null) ? result : result[0]
                    };
                }
                else {
                    result = {
                        content_types: result
                    };
                }
                break;
            default:
                if (this.internal.limit === 1) {
                    result = {
                        entry: (result === null) ? result : result[0]
                    };
                }
                else {
                    result = {
                        entries: result
                    };
                }
                break;
        }
        if (this.internal.includeCount) {
            result.count = count;
        }
        if (this._query.content_type_uid === '_assets') {
            this._query.content_type_uid = 'assets';
        }
        result.content_type_uid = this._query.content_type_uid;
        result.locale = this._query.locale;
        this.cleanup();
        return result;
    }
    cleanup() {
        this.query = null;
        this.internal = {};
        this._query = {};
    }
    find(query = {}) {
        return new Promise((resolve, reject) => {
            this.preProcess(query);
            const filters = Object.assign({ content_type_uid: this._query.content_type_uid, locale: this._query.locale }, this._query.query);
            return this.collection
                .find(filters, this.internal.projections)
                .limit(this.internal.limit)
                .skip(this.internal.skip)
                .toArray()
                .then((result) => {
                result = this.postProcess(result);
                return resolve(result);
            })
                .catch((error) => {
                this.cleanup();
                return reject(error);
            });
        });
    }
}
exports.Stack = Stack;
//# sourceMappingURL=stack.js.map