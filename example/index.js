const Contentstack = require('../dist/contentstack')

const Stack = Contentstack.Stack({
  api_key: 'blt46203405576620e7',
  access_token: 'blt468dc99e0a65476c',
  locales: [
    {
      code: 'en-us',
      relative_url_prefix: '/'
    },
    {
      code: 'es-es',
      relative_url_prefix: '/es/'
    }
  ]
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

function find (contentType = 'multiassets') {
  return new Promise((resolve, reject) => {
    Stack.contentType(contentType)
      .entries()
      .includeCount()
      .includeReferences()
      // .includeSchema()
      .language('es-es')
      // .limit(1)
      // .skip(1)
      // .query({
      //   "data.uid": 'blt17559b99fee73d6f'
      // })
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
        //   locale: 'es-es'
        // }
        console.log(JSON.stringify(result, null, 1))
      })
  })
  .then(close)
  .then(() => {
    console.info('Data received successfully!')
  })
  .catch(console.error)
