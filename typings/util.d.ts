/*!
 * Contentstack Sync Mongodb SDK
 * Copyright (c) 2019 Contentstack LLC
 * MIT Licensed
 */
/**
 * @summary
 *  Validates the mongodb 'uri' passed
 * @param {String} uri - Mongodb connection 'uri' string
 * @returns {String} - Returns the `uri` after validating it, else throws an error
 */
export declare const validateURI: (uri: any) => string;
/**
 * @summary
 *  Checks for `cyclic` references
 * @param {String} uid - Uid to check if it exists on `map`
 * @param {Object} mapping - Map of the uids tracked thusfar
 * @returns {Boolean} - Returns `true` if the `uid` is part of the map (i.e. cyclic)
 */
export declare const checkCyclic: (uid: any, mapping: any) => boolean;
