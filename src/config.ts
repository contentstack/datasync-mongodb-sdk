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
    userNewUrlParser: true,
  },
  projections: {
    'data.created_by': 0,
    'data.updated_by': 0,
    'data.created_at': 0,
    'data.updated_at': 0,
    'data.publish_details': 0,
    'data._version': 0,
    '_id': 0,
  },
  skip: 0,
  uri: 'mongodb://localhost:27017',
}
