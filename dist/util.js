"use strict";
/*!
 * Contentstack Sync Mongodb SDK
 * Copyright (c) 2019 Contentstack LLC
 * MIT Licensed
 */
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
/**
 * @summary
 *  Validates the mongodb 'uri' passed
 * @param {String} uri - Mongodb connection 'uri' string
 * @returns {String} - Returns the `uri` after validating it, else throws an error
 */
exports.validateURI = (uri) => {
    if (typeof uri !== 'string' || uri.length === 0) {
        throw new Error(`Mongodb connection url: ${uri} must be of type string`);
    }
    return uri;
};
/**
 * @summary
 *  Checks for `cyclic` references
 * @param {String} uid - Uid to check if it exists on `map`
 * @param {Object} mapping - Map of the uids tracked thusfar
 * @returns {Boolean} - Returns `true` if the `uid` is part of the map (i.e. cyclic)
 */
exports.checkCyclic = (uid, mapping) => {
    let flag = false;
    let list = [uid];
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
