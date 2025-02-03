import {
  isSomeString,
  isObject,
  isArray,
  isEmpty,
  isFunction,
} from "@locustjs/base";

class ExtensionHelper {
  constructor(options, logger) {
    this._options = this.configure(options);
    this.logger = logger;
  }
  get options() {
    return (
      this._options || {
        include: ["*"],
        exclude: [],
      }
    );
  }
  _configure(arg) {
    let result = [];

    if (isSomeString(arg)) {
      result = arg.split(",");
    } else if (isArray(arg)) {
      result = arg;
    }

    result = result.filter(isSomeString).map((x) => x.trim());

    return result;
  }
  configure(options) {
    let result;

    if (isEmpty(options)) {
      result = {
        include: ["*"],
        exclude: [],
      };
    } else if (isArray(options)) {
      result = {
        include: options,
        exclude: [],
      };
    } else if (isObject(options)) {
      result = options;
    } else {
      result = {
        include: options,
        exclude: arguments.length > 1 ? arguments[1] : [],
      };
    }

    result.include = this._configure(result.include);
    result.exclude = this._configure(result.exclude);

    return result;
  }
  shouldExtend(fnName) {
    return (
      isSomeString(fnName) &&
      isObject(this.options) &&
      isArray(this.options.include) &&
      isArray(this.options.exclude) &&
      (this.options.include.indexOf("*") >= 0 ||
        this.options.include.indexOf(fnName) >= 0) &&
      this.options.exclude.indexOf(fnName) < 0
    );
  }
  _warn(msg) {
    if (this.logger && isFunction(this.logger.warn)) {
      this.logger.warn(msg);
    }
  }
  _log(msg) {
    if (this.logger && isFunction(this.logger.log)) {
      this.logger.log(msg);
    }
  }
  extend(obj, fnName, fn, direct = false) {
    if (obj && this.shouldExtend(fnName)) {
      if (!direct && obj.prototype == null) {
        obj.prototype = {};

        this._warn(
          "prototype is not an object. a default {} object assigned to prototype."
        );
      }

      const target = direct ? obj : obj.prototype;

      if (target[fnName] === undefined || this.options.force) {
        Object.defineProperty(target, fnName, {
          value: fn,
          writable: true,
          configurable: true,
        });

        this._log(`${fnName} extended.`);
      } else {
        this._warn(`${fnName} is already extended.`);
      }
    } else {
      if (obj) {
        this._warn(`${fnName} is not requested to be extended.`);
      } else {
        this._warn("nothing to be extended is given.");
      }
    }
  }
}

export default ExtensionHelper;
