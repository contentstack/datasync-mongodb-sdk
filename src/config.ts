/*!
 * Contentstack Sync Mongodb SDK
 * Copyright (c) 2019 Contentstack LLC
 * MIT Licensed
 */

export const config = {
  collectionName: 'contents',
  dbName: 'contentstack-persistent-db',
  limit: 100,
  locales: [
  ],
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
    content_type_uid: 0,
    created_at: 0,
    sys_keys: 0,
    updated_at: 0,
    updated_by: 0,
  },
  skip: 0,
  uri: 'mongodb://localhost:27017',
}
