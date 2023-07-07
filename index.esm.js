import { isSomeString, isObject, isArray, isEmpty, isFunction } from '@locustjs/base'

class ExtensionHelper {
	constructor(options, logger) {
		this._options = this.configure(options);
		this.logger = logger;
	}
	get options() {
		return this._options || {
			include: ['*'],
			exclude: []
		}
	}
	_configure(arg) {
		let result = [];

		if (isSomeString(arg)) {
			result = arg.split(',').filter(x => isSomeString(x)).map(x => x.trim());
		} else if (isArray(arg)) {
			result = arg.filter(x => isSomeString(x)).map(x => x.trim());
		}

		return result;
	}
	configure(options) {
		let result;

		if (isEmpty(options)) {
			result = {
				include: ['*'],
				exclude: []
			}
		} else if (isArray(options)) {
			result = {
				include: options,
				exclude: []
			}
		} else if (isObject(options)) {
			result = options
		} else {
			result = {
				include: options,
				exclude: arguments.length > 1 ? arguments[1] : []
			}
		}

		result.include = this._configure(result.include);
		result.exclude = this._configure(result.exclude);

		return result;
	}
	shouldExtend(fnName) {
		return isSomeString(fnName) &&
			isObject(this.options) &&
			isArray(this.options.include) &&
			isArray(this.options.exclude) &&
			(this.options.include.indexOf('*') >= 0 || this.options.include.indexOf(fnName) >= 0) &&
			this.options.exclude.indexOf(fnName) < 0
	}
	extend(obj, fnName, fn) {
		if (obj && this.shouldExtend(fnName)) {
			if (!isObject(obj.prototype)) {
				obj.prototype = {}

				if (this.logger && isFunction(this.logger.warn)) {
					this.logger.warn('prototype is not an object. a default {} object assigned to prototype.');
				}
			}

			if (obj.prototype[fnName] === undefined || this.options.force) {
				obj.prototype[fnName] = fn;

				if (this.logger && isFunction(this.logger.log)) {
					this.logger.log(`${fnName} extended.`);
				}
			} else {
				if (this.logger && isFunction(this.logger.warn)) {
					this.logger.warn(`${fnName} is already extended.`);
				}
			}
		} else {
			if (this.logger && isFunction(this.logger.warn)) {
				if (obj) {
					this.logger.warn(`${fnName} is not requested to be extended.`);
				} else {
					this.logger.warn('nothing to be extended is given.');
				}
			}
		}
	}
}

export default ExtensionHelper;