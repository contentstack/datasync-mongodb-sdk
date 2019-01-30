import { Stack } from './stack'

/**
 * @method Contentstack
 * @description Creates an instance of `Contentstack`.
 * @api public
 */
class Contentstack {
  /**
	 * @method Stack
	 * @description Initialize an instance of ‘Stack’
	 * @api public
	 * @example
	 * const Stack = Contentstack.Stack('api_key', 'delivery_token', 'environment')
        OR
	 * const Stack = Contentstack.Stack({
	 *  api_key: 'api_key',
	 *  access_token: 'delivery_token',
	 *  environment: 'environment_name'
	 * })
	 *
	 * @returns {Stack}
	 */
  public Stack(...stack_arguments) {
    return new Stack(...stack_arguments)
  }
}

module.exports = new Contentstack()
