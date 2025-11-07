/*!
 * Contentstack DataSync Mongodb SDK
 * Copyright (c) 2019 Contentstack LLC
 * MIT Licensed
 */

import { uniq } from 'lodash'
import { ErrorMessages } from './messages'

/**
 * @private
 * @method validateURI
 * @description
 * Validates the mongodb 'uri' passed
 * @param {string} uri - Mongodb connection 'uri' string
 * @returns {string} - Returns the `uri` after validating it, else throws an error
 */
export const validateURI = (uri) => {
  if (typeof uri !== 'string' || uri.length === 0) {
    throw new Error(ErrorMessages.INVALID_MONGODB_URI(uri))
  }

  return uri
}

/**
 * @private
 * @method checkCyclic
 * @summary Checks for `cyclic` references
 * @param {string} uid Uid to check if it exists on `map`
 * @param {object} mapping Map of the uids tracked thusfar
 * @returns {boolean} Returns `true` if the `uid` is part of the map (i.e. cyclic)
 */
export const checkCyclic = (uid, mapping) => {
  let flag = false
  let list = [uid]
  // tslint:disable-next-line: prefer-for-of
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

const validateContentStore = (contentStore) => {
  if (typeof contentStore.dbName !== 'string' || contentStore.dbName.length === 0) {
    throw new Error(ErrorMessages.INVALID_DBNAME)
  }

  if (typeof contentStore.collectionName === 'string') {
    contentStore.collection = {
      asset: contentStore.collectionName,
      entry: contentStore.collectionName,
      schema: contentStore.collectionName,
    }

    delete contentStore.collectionName
  }

  return
}

export const validateConfig = (config) => {
  validateContentStore(config.contentStore)

  return
}

export const getCollectionName = ({locale, content_type_uid}, collection) => {
  switch (content_type_uid) {
    case '_assets':
      return `${locale}.${collection.asset}`
    case '_content_types':
      return `${locale}.${collection.schema}`
    default:
      return `${locale}.${collection.entry}`
  }
}
