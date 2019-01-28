const Contentstack = require('../dist/contentstack')

const Stack = Contentstack.Stack({
  api_key: 'blt46203405576620e7',
  access_token: 'blt468dc99e0a65476c'
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
        console.log(keys)
        console.log(result[keys[0]])
      })
  })
  .then(close)
  .then(() => {
    console.info('Data received successfully!')
  })
  .catch(console.error)
