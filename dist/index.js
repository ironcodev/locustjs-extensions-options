'use strict';

var base = require('@locustjs/base');

function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || false, o.configurable = true, "value" in o && (o.writable = true), Object.defineProperty(e, _toPropertyKey(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), Object.defineProperty(e, "prototype", {
    writable: false
  }), e;
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (undefined !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (String )(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}

var ExtensionHelper = /*#__PURE__*/function () {
  function ExtensionHelper(options, logger) {
    _classCallCheck(this, ExtensionHelper);
    this._options = this.configure(options);
    this.logger = logger;
  }
  return _createClass(ExtensionHelper, [{
    key: "options",
    get: function get() {
      return this._options || {
        include: ["*"],
        exclude: []
      };
    }
  }, {
    key: "_configure",
    value: function _configure(arg) {
      var result = [];
      if (base.isSomeString(arg)) {
        result = arg.split(",");
      } else if (base.isArray(arg)) {
        result = arg;
      }
      result = result.filter(base.isSomeString).map(function (x) {
        return x.trim();
      });
      return result;
    }
  }, {
    key: "configure",
    value: function configure(options) {
      var result;
      if (base.isEmpty(options)) {
        result = {
          include: ["*"],
          exclude: []
        };
      } else if (base.isArray(options)) {
        result = {
          include: options,
          exclude: []
        };
      } else if (base.isObject(options)) {
        result = options;
      } else {
        result = {
          include: options,
          exclude: arguments.length > 1 ? arguments[1] : []
        };
      }
      result.include = this._configure(result.include);
      result.exclude = this._configure(result.exclude);
      return result;
    }
  }, {
    key: "shouldExtend",
    value: function shouldExtend(fnName) {
      return base.isSomeString(fnName) && base.isObject(this.options) && base.isArray(this.options.include) && base.isArray(this.options.exclude) && (this.options.include.indexOf("*") >= 0 || this.options.include.indexOf(fnName) >= 0) && this.options.exclude.indexOf(fnName) < 0;
    }
  }, {
    key: "_warn",
    value: function _warn(msg) {
      if (this.logger && base.isFunction(this.logger.warn)) {
        this.logger.warn(msg);
      }
    }
  }, {
    key: "_log",
    value: function _log(msg) {
      if (this.logger && base.isFunction(this.logger.log)) {
        this.logger.log(msg);
      }
    }
  }, {
    key: "extend",
    value: function extend(obj, fnName, fn) {
      var direct = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      if (obj && this.shouldExtend(fnName)) {
        if (!direct && obj.prototype == null) {
          obj.prototype = {};
          this._warn("prototype is not an object. a default {} object assigned to prototype.");
        }
        var target = direct ? obj : obj.prototype;
        if (target[fnName] === undefined || this.options.force) {
          Object.defineProperty(target, fnName, {
            value: fn,
            writable: true,
            configurable: true
          });
          this._log("".concat(fnName, " extended."));
        } else {
          this._warn("".concat(fnName, " is already extended."));
        }
      } else {
        if (obj) {
          this._warn("".concat(fnName, " is not requested to be extended."));
        } else {
          this._warn("nothing to be extended is given.");
        }
      }
    }
  }]);
}();

module.exports = ExtensionHelper;
