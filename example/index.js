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
  contentStore: {
    dbName: 'mydb',
    collectionName: 'dev'
  }
})

function connect () {
  return new Promise((resolve, reject) => {
    return Stack.connect()
      .then(resolve)
      .catch(reject)
  })
}

function close () {
  return Stack.close()
}

function find (contentType = 'authors') {
  return new Promise((resolve, reject) => {
    Stack.contentType(contentType)
      .entries()
      .includeCount()
      .includeReferences()
      .includeSchema()
      .language('es-es')
      .notEqualTo('title', 'Kolan')
      .query({tags: {$in: ['one', 'two']}})
      .limit(10)
      .skip(1)
      .find()
      .then(resolve)
      .catch(reject)
  })
}

return connect()
  .then(() => {
    return find()
      .then((result) => {
        const keys = Object.keys(result)
        // Sample output
        // {
        //   entries: [
        //     {
        //       title: 'French author',
        //       gender: null,
        //       age: null,
        //       summary: '',
        //       tags: [
        //       ],
        //       locale: 'es-es',
        //       uid: 'blt17559b99fee73d6f'
        //     }
        //   ],
        //   content_type_uid: 'authors',
        //   locale: 'es-es',
        //   count: 10
        // }
        console.log(JSON.stringify(result, null, 1))
        return
      })
  })
  .then(close)
  .catch(console.error)
