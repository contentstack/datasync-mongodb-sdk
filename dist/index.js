"use strict";
/*!
 * Contentstack DataSync Mongodb SDK
 * Copyright (c) 2019 Contentstack LLC
 * MIT Licensed
 */
Object.defineProperty(exports, "__esModule", { value: true });
const stack_1 = require("./stack");
/**
 * @class Stack
 * @description Initialize an instance of `Stack`
 * @api public
 * @example
 * const Stack = Contentstack.Stack({
 *  contentStore: {
 *    baseDir: '../../dev-contents'
 *  },
 *  locales: [
 *    {
 *      code: 'en-us',
 *      relative_url_prefix: '/'
 *    }
 *  ]
 * })
 *
 * @returns {Stack} Returns Stack method, which's used to create an instance of Stack
 */
class Contentstack {
    /**
     * @public
     * @method Stack
     * @summary Initialize Stack instance
     * @param {object} config Stack config
     * @param {object} db Existing db connection
     * @returns {Stack} - Returns an instance of `Stack`
     */
    static Stack(config, db) {
        return new stack_1.Stack(config, db);
    }
}
exports.Contentstack = Contentstack;
