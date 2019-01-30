/**
 * @description Test contentstack-mongodb-sdk basic methods
 */

// import { config } from '../src/config'
// import Contentstack from '../src/contentstack'
const Contentstack = require('../src/contentstack')
let Stack

describe('core', () => {
  test('initialize stack', () => {
    expect(Contentstack.Stack()).toHaveProperty('connect')
  })

  test('connect', () => {
    
  })
})