/*!
 * Contentstack DataSync Mongodb SDK
 * Copyright (c) 2019 Contentstack LLC
 * MIT Licensed
 */

export const config = {
  contentStore: {
    collection: {
      asset: 'contents',
      entry: 'contents',
      schema: 'content_types',
    },
    dbName: 'contentstack-db',
    // indexes: {
    //   event_at: -1,
    //   _content_type_uid: 1,
    //   locale: 1,
    //   uid: 1
    // },
    internalContentTypes: {
      assets: '_assets',
      content_types: '_content_types',
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
      _synced_at: 0,
      _version: 0,
      created_at: 0,
      updated_at: 0,
      updated_by: 0,
    },
    referenceDepth: 20,
    skip: 0,
    uri: 'mongodb://localhost:27017',
  },
}
