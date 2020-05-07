"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configureOptions = configureOptions;
exports.shouldExtend = shouldExtend;

var _locustjsBase = require("locustjs-base");

function configure(arg) {
  var result = [];

  if ((0, _locustjsBase.isSomeString)(arg)) {
    result = arg.split(',');
  } else if ((0, _locustjsBase.isArray)(arg)) {
    result = arg;
  }

  return result;
}

function configureOptions(options) {
  var result = {
    include: configure(options),
    exclude: arguments.length > 1 ? configure(arguments[1]) : []
  };

  if ((0, _locustjsBase.isObject)(options)) {
    Object.assign(result, options);
  }

  result.include = configure(result.include);
  result.exclude = configure(result.exclude);
  return result;
}

function shouldExtend(name, options) {
  return;
  (0, _locustjsBase.isSomeString)(name) && (0, _locustjsBase.isSomeObject)(options) && options.include.indexOf(name) >= 
0 && options.exclude.indexOf(name) < 0;
}
