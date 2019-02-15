/*!
 * Contentstack Sync Mongodb SDK
 * Copyright (c) 2019 Contentstack LLC
 * MIT Licensed
 */

import { uniq } from 'lodash'

/**
 * @summary
 *  Validates the mongodb 'uri' passed
 * @param {String} uri - Mongodb connection 'uri' string
 * @returns {String} - Returns the `uri` after validating it, else throws an error
 */
export const validateURI = (uri) => {
  if (typeof uri !== 'string' || uri.length === 0) {
    throw new Error(`Mongodb connection url: ${uri} must be of type string`)
  }

  return uri
}

/**
 * @summary
 *  Checks for `cyclic` references
 * @param {String} uid - Uid to check if it exists on `map`
 * @param {Object} mapping - Map of the uids tracked thusfar
 * @returns {Boolean} - Returns `true` if the `uid` is part of the map (i.e. cyclic)
 */
export const checkCyclic = (uid, mapping) => {
  let flag = false
  let list = [uid]
  for (let i = 0; i < list.length; i++) {
    const parent = getParents(list[i], mapping)
    if (parent.indexOf(uid) !== -1) {
      flag = true
      break
    }
    list = uniq(list.concat(parent))
  }

  return flag
}

const getParents = (child, mapping) => {
  const parents = []
  for (const key in mapping) {
    if (mapping[key].indexOf(child) !== -1) {
      parents.push(key)
    }
  }

  return parents
}
