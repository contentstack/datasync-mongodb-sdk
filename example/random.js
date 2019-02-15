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
  collectionName: 'count'
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
    // .includeReferences()
    // .where(function () {
    //   return (this.no === 1)
    // })
    .queryReferences({'authors.uid': 'a10'})
    // .only(['published_at'])
    // .except(['published_at'])
    // .ascending()
    // .descending()
    // .and([{uid: 'b1'}, {no: 1}])
    // .find()
    .count()
    .then(console.log)
    .catch(console.error)
})