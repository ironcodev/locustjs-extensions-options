# About
This library provides a helper `ExtensionHelper` class that is used in other `locustjs-extensions` libraries.

## Options
`ExtensionHelper` constructor has two parameters:

```javascript
ExtensionHelper(options, logger)
```

### constructor parameters

| Parameter | Type | Required |
|-----------|------|----------|
| `options` | `object`, `string`, `array` | yes |
| `logger` | `object` | no |

Structure of `options` as an object is as follows:
```json
{
    "include": [...],
    "exclude": [...]
}
```

`include` specifies list of function names that are going to be extended on a target object. The default value is `*`. It says all functions should be extended.

`exclude` specifies list of function names that should be skipped or ignored and should be extended on the target obejct.

If a `string` or `array` is passed as `options` parameter to `ExtensionHelper` constructor, it is used as a value for `includes` property.

### methods

| method | description |
|-----------|----------------|
| `configure(options)` | gets an `options` argument in the form of `object`, `string` or `array`, validate it and returns an options object |
| `shouldExtend(fnName)` | Based on an options passed to current `ExtensionHelper` instance, checks whether given `fnName` should be extended or not and returns `true` or `false`. |
| `extend(obj, fnName, fn)` | Checks whether `fnName` function could be extended or not and if so, extends `fn` function with the name `fnName` on given `obj` object. |

## Example
```javascript
const eh = new ExtensionHelper('min, max')

eh.extend(Array, 'min', function () {
    ...
})
```
