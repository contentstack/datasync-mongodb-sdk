"use strict";
/*!
 * Contentstack DataSync Mongodb SDK
 * Copyright (c) 2019 Contentstack LLC
 * MIT Licensed
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = {
    contentStore: {
        collection: {
            entry: 'contents',
            asset: 'contents',
            schema: 'content_types',
        },
        dbName: 'contentstack-db',
        indexes: {
            event_at: -1,
            _content_type_uid: 1,
            locale: 1,
            uid: 1
        },
        internalContentTypes: {
            content_types: '_content_types',
            assets: '_assets'
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
            _id: 0,
            _version: 0,
            _content_type_uid: 0,
            _synced_at: 0,
            app_user_object_uid: 0,
            created_at: 0,
            updated_at: 0,
            updated_by: 0,
        },
        skip: 0,
        uri: 'mongodb://localhost:27017',
    }
};
