/*!
 * Contentstack Sync Mongodb SDK
 * Copyright (c) 2019 Contentstack LLC
 * MIT Licensed
 */
import { Stack } from './stack';
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
 * @returns {Stack}
 */
export declare class Contentstack {
    /**
     * @summary
     * 	Initialize Stack instance
     * @param {Object} stack_arguments - Stack config
     */
    static Stack(config?: any, db?: any): Stack;
}
