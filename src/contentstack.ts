/*!
 * Contentstack Sync Mongodb SDK
 * Copyright (c) 2019 Contentstack LLC
 * MIT Licensed
 */

import { Stack } from './stack'

/**
 * @method Contentstack
 * @description Creates an instance of `Contentstack`.
 * @api public
 */
class Contentstack {
	/**
	 * @summary
	 * 	Initialize Stack instance
	 * @param {Object} stack_arguments - Stack config
	 */
  public Stack(config, db) {
    return new Stack(config, db)
  }
}

module.exports = new Contentstack()
