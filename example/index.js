const Contentstack = require('../dist').Contentstack

const Stack = Contentstack.Stack({
  // locale: 'en-us',
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
      // .include(['reference_b'])
      // .include([
      //   'group.group.reference.reference_b.reference.reference',
      // ])
      // .include(['group.group.reference.reference_b.reference.reference', 'group.group.reference.reference_one',
      //   'group.group.reference.reference_two', 'group.group.reference.self_reference',
      //   'modular_blocks.block_one.reference', 'modular_blocks.block_two.group.reference.authors',
      //   'modular_blocks.block_two.group.reference.categories'
      // ])
      // .includeSchema()
      // .language('es-es')
      // .notEqualTo('title', 'Kolan')
      // .query({tags: {$in: ['one', 'two']}})
      .limit(1)
      // .skip(1)
      .find()
      .then(resolve)
      .catch(reject)
  })
}

return connect()
  .then(() => {
    console.time('t')
    return find()
      .then((result) => {
        console.timeEnd('t')
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
