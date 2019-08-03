[![Contentstack](https://www.contentstack.com/docs/static/images/contentstack.png)](https://www.contentstack.com/)

Contentstack is a headless CMS with an API-first approach. It is a CMS that developers can use to build powerful cross-platform applications in their favorite languages. Build your application frontend, and Contentstack will take care of the rest. [Read More](https://www.contentstack.com/).

## Contentstack DataSync MongoDB SDK

[Contentstack DataSync](https://www.contentstack.com/docs/guide/synchronization/contentstack-datasync) provides MongoDB SDK to query applications that have locally stored contents in mongodb. Given below is the detailed guide and helpful resources to get started.

### Prerequisite

- Nodejs, v8+
- MongoDB, v3.6 or higher
- You should have the data synced through [Contentstack DataSync](https://www.contentstack.com/docs/guide/synchronization/contentstack-datasync) 

**Note**
For optimal performance, we recommend that you add indexes on the following keys of your collections
- `_content_type_uid: 1`
- `uid: 1`
- `locale: 1`
<!-- Since by default, the contents are sorted in descending order on 'updated_at' key -->
- `updated_at: -1`

### Configuration

|Property|Type|Default value|Description|
|--|--|--|--|
|dbName|string|contentstack-persistent-db|**Optional** The MongoDB database name|
|collection|string|contents|**Optional** MongoDB database's collection names|
|url|string|mongodb://localhost:27017 |**Optional.** The MongoDB connection URI|
|limit|number|100|**Optional.** Caps the total no of objects returned in a single call|
|skip|number|0|**Optional.** Number of objects skipped before the result is returned|
| indexes | object |**[see config below](https://github.com/contentstack/datasync-content-store-mongodb#detailed-configs)** |**Optional.** Option to create db indexes via configuration|
|projections|object|**[see config below](https://github.com/contentstack/datasync-content-store-mongodb#detailed-configs)** |**Optional.** Mongodb projections. Keys provided here would be displayed/filtered out when fetching the result|
|options|object|**[see config below](https://github.com/contentstack/datasync-content-store-mongodb#detailed-configs)** |**Optional.** MongoDB connection options [Ref.](http://mongodb.github.io/node-mongodb-native/3.1/api/MongoClient.html) for more info|
|referenceDepth|number|2|**Optional** The default nested-reference-field depth that'd be considered when calling .includeReferences(). This can be overridden by passing a numerical argument to .includeReferences(4)|

### Config Overview

Here's an overview of the SDK's configurable properties

```ts
{
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
}
```

### Sample SDK Query

Here's a sample SDK query to get started.

Learn more on how to query using datasync-mongodb-sdk [here](https://contentstack.github.io/datasync-mongodb-sdk/).

```ts
import { Contentstack } from 'datasync-mongodb-sdk'
const Stack = Contentstack.Stack(config)

Stack.connect()
  .then(() => {
    return Stack.contentType('blog')
      .entries()
      .language('en-gb') // Optional. If not provided, defaults to en-us
      .include(['authors'])
      .includeCount()
      .includeContentType()
      .queryReferences({'authors.firstName': 'R.R. Martin'})
      .then((result) => {
        // Your result would be
        // {
        //   entries: [...], // All entries, who's first name is R.R. Martin
        //   content_type_uid: 'blog',
        //   locale: 'es-es',
        //   content_type: {...}, // Blog content type's schema
        //   count: 3, // Total count of blog content type
        // }
      })
  })
  .catch((error) => {
    // handle errors..
  })
```
> Important: You need to call .connect(), to initiate SDK queries!

Once you have initialized the SDK, you can start querying on mongodb

### Querying
- Notes
  - By default, 'content_type_uid' and 'locale' keys as part of the response.
  - If `.language()` is not provided, then the 1st language, provided in `config.defaultLocale` would be considered.
  - If querying for a single entry/asset (using `.entry()` OR `.findOne()`), the result will be an object i.e. `{ entry: {} }`, if the entry or asset is not found, `{ entry: null }` will be returned.
  - Querying multiple entries, would return `{ entries: [ {...} ] }`.
  - By default, all entry responses would include their referred assets. If `.excludeReferences()` is called, no references (including assets) would **not** be returned in the response.

- Query a single entry
```ts
// Sample 1. Returns the 1st entry that matches query filters
Stack.contentType('blog')
  .entry() // OR .asset()
  .find()
  .then((result) => {
    // Response
    // result = {
    //   entry: any | null,
    //   content_type_uid: string,
    //   locale: string,
    // }
  })
  .catch(reject)

// Sample 2. Returns the 1st entry that matches query filters
Stack.contentType('blogs')
  .entries() // for .assets() 
  .findOne()
  .then((result) => {
    // Response
    // result = {
    //   entry: any | null,
    //   content_type_uid: string,
    //   locale: string,
    // }
  })
  .catch(reject)
```

- Querying a set of entries, assets or content types
```ts
Stack.contentType('blog')
  .entries() // for .assets() 
  .includeCount()
  .find()
  .then((result) => {
    // Response
    // result = {
    //   entry: any | null,
    //   content_type_uid: string,
    //   count: number,
    //   locale: string,
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

If you have any issues working with the library, please file an issue [here](https://github.com/contentstack/datasync-mongodb-sdk/issues) at Github.

You can send us an e-mail at [support@contentstack.com](mailto:support@contentstack.com) if you have any support or feature requests. Our support team is available 24/7 on the intercom. You can always get in touch and give us an opportunity to serve you better!

### License

This repository is published under the [MIT license](LICENSE).
