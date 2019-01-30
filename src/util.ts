import { uniq } from 'lodash'

export const append = (field) => {

  return `data.${field}`
}

export const validateURI = (uri) => {
  if (typeof uri !== 'string' || uri.length === 0) {
    throw new Error(`Mongodb connection url: ${uri} must be of type string`)
  }

  return uri
}

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
