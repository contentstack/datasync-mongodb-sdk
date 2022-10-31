"use strict";
/*!
 * Contentstack DataSync Mongodb SDK
 * Copyright (c) 2019 Contentstack LLC
 * MIT Licensed
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    contentStore: {
        collection: {
            asset: 'contents',
            entry: 'contents',
            schema: 'content_types',
        },
        dbName: 'contentstack-db',
        indexes: {
            _content_type_uid: 1,
            locale: 1,
            uid: 1,
            updated_at: -1,
        },
        internal: {
            types: {
                assets: '_assets',
                content_types: '_content_types',
                references: '_references',
            },
        },
        limit: 100,
        locale: 'en-us',
        // http://mongodb.github.io/node-mongodb-native/3.1/api/MongoClient.html
        options: {
            autoReconnect: true,
            connectTimeoutMS: 15000,
            keepAlive: true,
            noDelay: true,
            reconnectInterval: 1000,
            reconnectTries: 20,
            useNewUrlParser: true,
        },
        projections: {
            _content_type_uid: 0,
            _id: 0,
        },
        referenceDepth: 2,
        skip: 0,
        url: 'mongodb://localhost:27017',
    },
};
