"use strict";
/*!
 * Contentstack DataSync Mongodb SDK
 * Copyright (c) 2019 Contentstack LLC
 * MIT Licensed
 */
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
/**
 * @private
 * @method validateURI
 * @description
 * Validates the mongodb 'uri' passed
 * @param {string} uri - Mongodb connection 'uri' string
 * @returns {string} - Returns the `uri` after validating it, else throws an error
 */
exports.validateURI = (uri) => {
    if (typeof uri !== 'string' || uri.length === 0) {
        throw new Error(`Mongodb connection url: ${uri} must be of type string`);
    }
    return uri;
};
/**
 * @private
 * @method checkCyclic
 * @summary Checks for `cyclic` references
 * @param {string} uid Uid to check if it exists on `map`
 * @param {object} mapping Map of the uids tracked thusfar
 * @returns {boolean} Returns `true` if the `uid` is part of the map (i.e. cyclic)
 */
exports.checkCyclic = (uid, mapping) => {
    let flag = false;
    let list = [uid];
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < list.length; i++) {
        const parent = getParents(list[i], mapping);
        if (parent.indexOf(uid) !== -1) {
            flag = true;
            break;
        }
        list = lodash_1.uniq(list.concat(parent));
    }
    return flag;
};
const getParents = (child, mapping) => {
    const parents = [];
    for (const key in mapping) {
        if (mapping[key].indexOf(child) !== -1) {
            parents.push(key);
        }
    }
    return parents;
};
const validateContentStore = (contentStore) => {
    if (typeof contentStore.dbName !== 'string' || contentStore.dbName.length === 0) {
        throw new Error('Contentstore dbName should be of type string and not empty!');
    }
    if (typeof contentStore.collectionName === 'string') {
        contentStore.collection = {
            asset: contentStore.collectionName,
            entry: contentStore.collectionName,
            schema: contentStore.collectionName,
        };
        delete contentStore.collectionName;
    }
    return;
};
exports.validateConfig = (config) => {
    validateContentStore(config.contentStore);
    return;
};
exports.getCollectionName = ({ locale, content_type_uid }, collection) => {
    switch (content_type_uid) {
        case '_assets':
            return `${locale}.${collection.asset}`;
        case '_content_types':
            return `${locale}.${collection.schema}`;
        default:
            return `${locale}.${collection.entry}`;
    }
};
exports.difference = (obj, baseObj) => {
    const changes = (data, base) => {
        return lodash_1.transform(data, (result, value, key) => {
            if (!lodash_1.isEqual(value, base[key])) {
                result[key] = (lodash_1.isObject(value) && lodash_1.isObject(base[key])) ? changes(value, base[key]) : value;
            }
        });
    };
    return changes(obj, baseObj);
};
exports.applyProjections = (data, keys, depth, parent) => {
    for (let prop in data) {
        if (prop === keys[depth] && keys.length - 1 === depth) {
            let field = keys.slice(-1).pop();
            let array = keys;
            array.pop();
            if ((array.join('.')) === parent)
                delete data[field];
        }
        else if (typeof data[prop] === 'object') {
            if (prop === keys[depth]) {
                depth = depth + 1;
                parent = parent !== '' ? parent + '.' + prop : prop;
                if (data[prop] instanceof Array) {
                    data[prop].forEach(element => {
                        exports.applyProjections(element, keys, depth, parent);
                    });
                }
                else {
                    exports.applyProjections(data[prop], keys, depth, parent);
                }
            }
        }
    }
};
