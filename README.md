[![Contentstack](https://www.contentstack.com/docs/static/images/contentstack.png)](https://www.contentstack.com/)

Contentstack is a headless CMS with an API-first approach. It is a CMS that developers can use to build powerful cross-platform applications in their favorite languages. Build your application frontend, and Contentstack will take care of the rest. [Read More](https://www.contentstack.com/).

## Contentstack DataSync MongoDB SDK

[Contentstack DataSync](https://www.contentstack.com/docs/guide/synchronization/contentstack-datasync) provides MongoDB SDK to query applications that have locally stored contents in mongodb. Given below is the detailed guide and helpful resources to get started.

### Prerequisite

- nodejs, v8+
- MongoDB, v3.6 or higher
- You should have the data synced through [Contentstack DataSync](https://www.contentstack.com/docs/guide/synchronization/contentstack-datasync) 

### Configuration

|Property|Data Type|Default value|Description|
|--|--|--|--|
|dbName|string|contentstack-persistent-db|**Optional** The MongoDB database name|
|collectionName|string|contents|**Optional** MongoDB database's collection name|
|uri|string|mongodb://localhost:27017 |**Optional.** The MongoDB connection URI|
|limit|number|100|**Optional.** Caps the total no of objects returned in a single call|
|skip|number|0|**Optional.** Number of objects skipped before the result is returned|
| indexes | object |**[see config below](https://github.com/contentstack/datasync-content-store-mongodb#detailed-configs)** |**Optional.** Option to create db indexes via configuration|
|projections|object|**[see config below](https://github.com/contentstack/datasync-content-store-mongodb#detailed-configs)** |**Optional.** Mongodb projections. Keys provided here would be displayed/filtered out when fetching the result|
|options|object|**[see config below](https://github.com/contentstack/datasync-content-store-mongodb#detailed-configs)** |**Optional.** MongoDB connection options [Ref.](http://mongodb.github.io/node-mongodb-native/3.1/api/MongoClient.html) for more info|

### Detailed configs

By default, this module uses the following internal configuration.

```js
{
  dbName: 'contentstack-persistent-db',
  collectionName: 'contents',
  uri: 'mongodb://localhost:27017',
  indexes: {
    published_at: -1,
    content_type_uid: 1,
    locale: 1,
    uid: 1
  },
  limit: 100,
  locales: [
  ],
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
}
```

### Setup and Installation

To import the SDK in your project, use the following command:
```js
  import { Contentstack } from 'contentstack-sync-mongodb-sdk'
```

To initialize the SDK, you'd need to perform the following steps

1. Initialize stack instance.
```js
  const Stack = Contentstack.Stack(config)
```

2. Call the connect method. This method establishes a connection between the SDK and mongodb database.
```js
  Stack.connect(dbConfig)
    .then(fnResolve)
    .catch(fnReject)
```
> Important: You need to call this, before running SDK queries!

Once you have initialized the SDK, you can start querying on the sync-utility's DB's

### Querying

- Notes
  - By default, 'content_type_uid' and 'locale' keys as part of the response.
  - If `.language()` is not provided, then the 1st language, provided in `config.locales` would be considered.
  - If querying for a single entry/asset (using `.entry()` OR `.findOne()`), the result will be an object i.e. `{ entry: {} }`, if the entry or asset is not found, `{ entry: null }` will be returned.
  - Querying multiple entries, would return `{ entries: [ {...} ] }`.


1. Query a single entry

```js
  // Sample 1. Returns the 1st entry that matches query filters
  Stack.contentType('blogs')
    .entry() // OR .asset()
    .language('en-us')
    .find()
    .then((result) => {
      // Response
      // result = {
      //   entry: {
      //     title: '' || null
      //   },
      //   content_type_uid: '',
      //   locale: ''
      // }
    })
    .catch(reject)

  // Sample 2. Returns the 1st entry that matches query filters
  Stack.contentType('blogs')
    .entries() // for .assets() OR .schemas() - ignore calling .contentType()
    .language('en-us')
    .findOne()
    .then((result) => {
      // Response
      // result = {
      //   entry: {
      //     title: '' || null
      //   },
      //   content_type_uid: '',
      //   locale: ''
      // }
    })
    .catch(reject)
```

2. Querying a set of entries, assets or content types
```js
  Stack.contentType('blogs')
    .entries() // for .assets() OR .schemas() - ignore calling .contentType()
    .includeCount()
    .find()
    .then((result) => {
      // Response
      // result = {
      //   entries: [
      //     {
      //       title: ''
      //     }
      //   ],
      //   content_type_uid: 'blogs',
      //   locale: '',
      //   count: 1
      // }
    })
    .catch(reject)
```

## Advanced Queries

In order to learn more about advance queries please refer the API documentation, [here](https://contentstack.github.io/datasync-mongodb-sdk/).

### Further Reading

- [Getting started with Contentstack DataSync](https://www.contentstack.com/docs/guide/synchronization/contentstack-datasync)    
- [Contentstack DataSync](https://www.contentstack.com/docs/guide/synchronization/contentstack-datasync/configuration-files-for-contentstack-datasync) doc lists the configuration for different modules

### Support and Feature requests

If you have any issues working with the library, please file an issue [here](https://github.com/contentstack/datasync-content-store-mongodb/issues) at Github.

You can send us an e-mail at [support@contentstack.com](mailto:support@contentstack.com) if you have any support or feature requests. Our support team is available 24/7 on the intercom. You can always get in touch and give us an opportunity to serve you better!

### License

This repository is published under the [MIT license](LICENSE).
