"use strict";
/*!
 * Contentstack Sync Mongodb SDK
 * Copyright (c) 2019 Contentstack LLC
 * MIT Licensed
 */
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
exports.append = (field) => {
    return `data.${field}`;
};
exports.validateURI = (uri) => {
    if (typeof uri !== 'string' || uri.length === 0) {
        throw new Error(`Mongodb connection url: ${uri} must be of type string`);
    }
    return uri;
};
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
exports.mask = (json, filter) => {
    filter.forEach((field) => {
        maskKeys(json, field.split('.'), 0);
    });
};
const maskKeys = (json, arr, pos) => {
    const key = arr[pos];
    if (json.hasOwnProperty(key)) {
        if (pos === arr.length - 1) {
            delete json[key];
        }
        else {
            pos++;
            maskKeys(json[key], arr, pos);
        }
    }
    else if (typeof json === 'object' && json instanceof Array && json.length) {
        json.forEach((sub) => {
            maskKeys(sub, arr, pos);
        });
    }
};
