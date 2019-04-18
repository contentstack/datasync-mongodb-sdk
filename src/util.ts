/*!
 * Contentstack DataSync Mongodb SDK
 * Copyright (c) 2019 Contentstack LLC
 * MIT Licensed
 */

import { uniq } from 'lodash'

/**
 * @private
 * 
 * @description
 * Validates the mongodb 'uri' passed
 * @param {string} uri - Mongodb connection 'uri' string
 * @returns {string} - Returns the `uri` after validating it, else throws an error
 */
export const validateURI = (uri) => {
  if (typeof uri !== 'string' || uri.length === 0) {
    throw new Error(`Mongodb connection url: ${uri} must be of type string`)
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

const validateLocales = (config) => {
  if (!(config.locales) || typeof config.locales !== 'object' || !(config.locales instanceof Array)) {
    throw new Error(`Kindly provide 'config.locales: [ { code: '' }, ...]'`)
  }

  config.locales.forEach((locale) => {
    if (!(locale) || typeof locale.code !== 'string' || locale.code.length === 0) {
      throw new Error(`Locale ${locale} is invalid!`)
    }
  })

  return
}

const validateContentStore = (contentStore) => {
  if (typeof contentStore.dbName !== 'string' || contentStore.dbName.length === 0) {
    throw new Error(`Contentstore dbName should be of type string and not empty!`)
  }

  if (typeof contentStore.collectionName !== 'string' || contentStore.collectionName.length === 0) {
    throw new Error(`Contentstore collectionName should be of type string and not empty!`)
  }

  return
}

export const validateConfig = (config) => {
  validateLocales(config)
  validateContentStore(config.contentStore)

  return
}
