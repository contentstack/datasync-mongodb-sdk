const Contentstack = require('../dist/contentstack').Contentstack

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
  dbName: 'sync-test'
})

Stack.connect().then(() => {
  Stack.asset()
    // .schemas()
    // .entries()
    .find()
    .then(console.log)
    .catch(console.error)
})