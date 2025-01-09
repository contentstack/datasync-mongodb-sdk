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
      connectTimeoutMS: 15000,
      // keepAlive: true, // The keepAlive option was deprecated in the Node.js Driver starting from version 5.3. In version 6.0 of the driver, the keepAlive option is permanently set to true
      noDelay: true,
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
}
