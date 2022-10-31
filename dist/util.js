"use strict";
/*!
 * Contentstack DataSync Mongodb SDK
 * Copyright (c) 2019 Contentstack LLC
 * MIT Licensed
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCollectionName = exports.validateConfig = exports.checkCyclic = exports.validateURI = void 0;
const lodash_1 = require("lodash");
/**
 * @private
 * @method validateURI
 * @description
 * Validates the mongodb 'uri' passed
 * @param {string} uri - Mongodb connection 'uri' string
 * @returns {string} - Returns the `uri` after validating it, else throws an error
 */
const validateURI = (uri) => {
    if (typeof uri !== 'string' || uri.length === 0) {
        throw new Error(`Mongodb connection url: ${uri} must be of type string`);
    }
    return uri;
};
exports.validateURI = validateURI;
/**
 * @private
 * @method checkCyclic
 * @summary Checks for `cyclic` references
 * @param {string} uid Uid to check if it exists on `map`
 * @param {object} mapping Map of the uids tracked thusfar
 * @returns {boolean} Returns `true` if the `uid` is part of the map (i.e. cyclic)
 */
const checkCyclic = (uid, mapping) => {
    let flag = false;
    let list = [uid];
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < list.length; i++) {
        const parent = getParents(list[i], mapping);
        if (parent.indexOf(uid) !== -1) {
            flag = true;
            break;
        }
        list = (0, lodash_1.uniq)(list.concat(parent));
    }
    return flag;
};
exports.checkCyclic = checkCyclic;
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
const validateConfig = (config) => {
    validateContentStore(config.contentStore);
    return;
};
exports.validateConfig = validateConfig;
const getCollectionName = ({ locale, content_type_uid }, collection) => {
    switch (content_type_uid) {
        case '_assets':
            return `${locale}.${collection.asset}`;
        case '_content_types':
            return `${locale}.${collection.schema}`;
        default:
            return `${locale}.${collection.entry}`;
    }
};
exports.getCollectionName = getCollectionName;
