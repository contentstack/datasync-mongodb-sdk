import { Stack } from './stack'

/**
 * @method Contentstack
 * @description Creates an instance of `Contentstack`.
 * @api public
 */
class Contentstack {
	constructor(){
	}

	/**
	 * @method Stack
	 * @description Initialize an instance of ‘Stack’
	 * @api public
	 * @example
	 *const Stack = Contentstack.Stack('api_key', 'delivery_token', 'environment')
                OR
	 *const Stack = Contentstack.Stack({
	 *    'api_key':'stack_api_key',
	 *    'access_token':'stack_delivery_token',
	 *    'environment':'environment_name'
	 * })
	 *
	 * @returns {Stack}
	 */
	Stack(...stack_arguments){
		return new Stack(...stack_arguments)
	}
}

module.exports = new Contentstack()