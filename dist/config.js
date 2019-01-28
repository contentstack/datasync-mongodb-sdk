"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = {
    collectionName: 'contents',
    dbName: 'contentstack-persistent-db',
    limit: 100,
    locales: [
        {
            code: 'es-es',
            relative_url_prefix: '/'
        }
    ],
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
        created_by: 0,
        updated_by: 0,
        created_at: 0,
        updated_at: 0
    },
    skip: 0,
    uri: 'mongodb://localhost:27017'
};
//# sourceMappingURL=config.js.map