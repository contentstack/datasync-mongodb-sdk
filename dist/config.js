"use strict";
/*!
 * Contentstack Sync Mongodb SDK
 * Copyright (c) 2019 Contentstack LLC
 * MIT Licensed
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = {
    collectionName: 'contents',
    dbName: 'contentstack-persistent-db',
    limit: 100,
    locales: [],
    options: {
        autoReconnect: true,
        connectTimeoutMS: 15000,
        keepAlive: true,
        noDelay: true,
        reconnectInterval: 1000,
        reconnectTries: 20,
        userNewUrlParser: true,
    },
    projections: {
        '_id': 0,
        'data._version': 0,
        'data.created_at': 0,
        'data.created_by': 0,
        'data.publish_details': 0,
        'data.updated_at': 0,
        'data.updated_by': 0,
    },
    skip: 0,
    uri: 'mongodb://localhost:27017',
};
