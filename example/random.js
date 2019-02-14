const Contentstack = require('../dist').Contentstack

const Stack = Contentstack.Stack({
  api_key: '',
  access_token: '',
  locales: [
    {
      code: 'en-us',
      relative_url_prefix: '/'
    },
    {
      code: 'es-es',
      relative_url_prefix: '/es/'
    }
  ],
  dbName: 'sync-test',
  collectionName: 'references'
})

Stack.connect({collectionName: 'logical'}).then(() => {
  // Stack.asset()
  //   // .schemas()
  //   // .entries()
  //   .find()
  //   .then(console.log)
  //   .catch(console.error)
  Stack.contentType('blog')
    .entries()
    .includeReferences()
    // .only(['published_at'])
    // .except(['published_at'])
    // .ascending()
    // .descending()
    // .and([{uid: 'b1'}, {no: 1}])
    .find()
    .then(console.log)
    .catch(console.error)
})