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

function find (contentType = 'blog') {
  return new Promise((resolve, reject) => {
    Stack.contentType(contentType)
      .entries()
      // .includeCount()
      .includeReferences()
      .queryReferences({'authors.category': {}})
      // .includeSchema()
      // .language('es-es')
      // .notEqualTo('title', 'Blog One')
      // .query({tags: {$in: ['one', 'two']}})
      .queryReferences({'authors.category.uid': 'c2'})
      // .excludeReferences()
      // .excludeAssets()
      // .limit(1)
      // .skip(1)
      // .query({
      //   uid: 'blt17559b99fee73d6f'
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
