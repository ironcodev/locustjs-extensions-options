import { isSomeString, isObject, isSomeObject, isArray, isSomeArray } from 'locustjs-base'

function configure(arg) {
	let result = [];
	
	if (isSomeString(arg)) {
		result = arg.split(',')
	} else if (isArray(arg)) {
		result = arg
	}
	
	return result;
}

function configureOptions(options) {
	let result = {
		include: configure(options),
		exclude: arguments.length > 1 ? configure(arguments[1]): []
	}
	
	if (isObject(options)) {
		Object.assign(result, options)
	}
	
	result.include = configure(result.include);
	result.exclude = configure(result.exclude);
	
	return result;
}

function shouldExtend(name, options) {
	return	
			isSomeString(name) &&
			isSomeObject(options) &&
			options.include.indexOf(name) >= 0 &&
			options.exclude.indexOf(name) < 0
}

export {
	configureOptions,
	shouldExtend
}