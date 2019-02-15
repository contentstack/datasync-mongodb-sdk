[![Contentstack](https://www.contentstack.com/docs/static/images/contentstack.png)](https://www.contentstack.com/)
## Contentstack Sync Mongodb SDK

Contentstack is a headless CMS with an API-first approach. It is a CMS that developers can use to build powerful cross-platform applications in their favorite languages. Build your application frontend, and Contentstack will take care of the rest. [Read More](https://www.contentstack.com/). 

[Contentstack sync utility](https://www.contentstack.com/docs/tools-and-frameworks) provides Mongodb SDK to query applications that have locally strored contents in mongodb. Given below is the detailed guide and helpful resources to get started with Mongodb SDK.

### Prerequisite

- nodejs, v6 or higher
- mongodb, v3.6 or higher

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
For more details on queries supported/querying, [refer this](./mongodb-sdk-querying.md)!