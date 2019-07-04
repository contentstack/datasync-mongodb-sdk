/*!
 * Contentstack DataSync Mongodb SDK
 * Copyright (c) 2019 Contentstack LLC
 * MIT Licensed
 */
/**
 * @private
 * @method validateURI
 * @description
 * Validates the mongodb 'uri' passed
 * @param {string} uri - Mongodb connection 'uri' string
 * @returns {string} - Returns the `uri` after validating it, else throws an error
 */
export declare const validateURI: (uri: any) => string;
/**
 * @private
 * @method checkCyclic
 * @summary Checks for `cyclic` references
 * @param {string} uid Uid to check if it exists on `map`
 * @param {object} mapping Map of the uids tracked thusfar
 * @returns {boolean} Returns `true` if the `uid` is part of the map (i.e. cyclic)
 */
export declare const checkCyclic: (uid: any, mapping: any) => boolean;
export declare const validateConfig: (config: any) => void;
export declare const getCollectionName: ({ locale, content_type_uid }: {
    locale: any;
    content_type_uid: any;
}, collection: any) => string;
