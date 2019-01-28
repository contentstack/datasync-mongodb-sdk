export const config = {
  collectionName: 'contents',
  dbName: 'contentstack-persistent-db',
  limit: 100,
  locales: [
    {
      code: 'es-es',
      relative_url_prefix: '/'
    }
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
    created_by: 0,
    updated_by: 0,
    created_at: 0,
    updated_at: 0
  },
  skip: 0,
  uri: 'mongodb://localhost:27017'
}
