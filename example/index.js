const Contentstack = require('../dist').Contentstack

const Stack = Contentstack.Stack({
  locale: 'en-us',
  contentStore: {
    dbName: 'references',
    collection: {
      entry: 'contents',
      asset: 'contents',
      schema: 'content_types'
    }
  }
})

function connect () {
  return Stack.connect()
}

function close () {
  return Stack.close()
}

function find (contentType = 'blog') {
  return Stack.contentType(contentType)
    .entries()
    .find()
}

return connect()
  .then(() => {
    return find()
      .then((result) => {
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
        console.log(JSON.stringify(result, null, 2))
        return
      })
  })
  .then(close)
  .catch(console.error)