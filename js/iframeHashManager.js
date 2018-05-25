(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["iframeHashManager"] = factory();
	else
		root["iframeHashManager"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// FP Primitive helpers
// Some primitive utility function for handling functions and arrays
// All functions in here are curried. https://www.sitepoint.com/currying-in-functional-javascript/
// use the log to debug compose

// compose :: List (a -> b) -> (a -> b)
// compose([ (x => x * x), (x => x - 2) ])(3), 7)
// Compose a list of unary functions.
// Unary means that the function has only one parameter
var compose = function compose(functions) {
  return function (initial) {
    return functions.reverse().reduceRight(function (result, fn) {
      return fn(result);
    }, initial);
  };
};

// map :: (a -> b) -> Array a -> Array b
// map(x => x * x)([1, 2, 3]) -> [1, 4, 9]
// Takes an unary function, and returns a function
// which takes an array. The first function is then
// executed on each item of the array, returning an array.
var map = function map(fn) {
  return function (arr) {
    return arr.map(fn);
  };
};

// map2 :: (a -> b -> c) -> Array a -> Array b -> Array c
// map2((x, y) => x * y)([1, 2, 3])([1, 2, 3]) -> [1, 4, 9]
// Like map, but takes two arrays and a binary function.
// Binary means that the function takes two parameters.
var map2 = function map2(fn) {
  return function (arr1) {
    return function (arr2) {
      return arr1.map(function (el, index) {
        return fn(el, arr2[index], index);
      });
    };
  };
};

// filter :: (a -> Boolean) -> Array a -> Array a
// filter(x => x > 1)([1, 2, 3]) -> [2, 3]
// Takes a predicate which is an unary returning a boolean value, and returns a function.
// The second function takes an array. The first function is then
// used to filter the items of the array, returning a subset.
var filter = function filter(fn) {
  return function (arr) {
    return arr.filter(fn);
  };
};

// join :: Array String -> String
// join(' ')(['Hello', 'World']) -> 'Hello World'
// Takes a delimiter, an array and joins the latter using the delimiter.
var join = function join(delimiter) {
  return function (arr) {
    return arr.join(delimiter);
  };
};

// log :: a -> a
// log('ThisShouldBeTrue')('2' == true) -> false
// A debug helper for composed functions.
var log = function log(tag) {
  return function (data) {
    console.log(tag);console.dir(data);return data;
  };
};

// tail :: Array a -> Array (Maybe a)
// tail([1, 2, 3]) -> [2,3]
// Takes an array and returns the array minus the first item.
var tail = function tail(arr) {
  return arr.slice(1, arr.length);
};

// split :: String -> String -> Array String
// split(' ')('Hello World') -> ['Hello', 'World']
// Like tail. Takes a delimiter, a string and returns an array of strings split using the delimiter
var split = function split(delim) {
  return function (str) {
    return str.split(delim);
  };
};

// difference :: Array -> Array -> Array
// difference(['a', 'b', 'c'])(['a', 'b']) -> ['c']
var difference = function difference(arr1) {
  return function (arr2) {
    return [].concat(_toConsumableArray(arr1)).filter(function (item) {
      return !new Set(arr2).has(item);
    });
  };
};

// flatten :: Array Array -> Array
// flatten([ ['a', 'b', 'c'], ['d', 'e'] ]) -> ['a', 'b', 'c', 'd', 'e']
var flatten = function flatten(arr) {
  var _Array$prototype;

  return (_Array$prototype = Array.prototype).concat.apply(_Array$prototype, _toConsumableArray(arr));
};

exports.default = {
  compose: compose,
  difference: difference,
  filter: filter,
  flatten: flatten,
  join: join,
  log: log,
  map: map,
  map2: map2,
  split: split,
  tail: tail
};
module.exports = exports["default"];

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fp = __webpack_require__(0);

var _fp2 = _interopRequireDefault(_fp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = { extractFromMaster: extractFromMaster, injectIntoMaster: injectIntoMaster, wrap: wrap, unwrapHash: unwrapHash

  // extractFromMaster :: String -> String -> String
}; // logic.js
// This file contains all the logic functions required for managing hashes
// This means none of these pure functions have any side effect or depenency on window etc.

function extractFromMaster(slaveHashId, masterHash) {
  // delimiters are hard-coded: _[id]. and _,
  var slaveHashPattern = new RegExp('_' + slaveHashId + '.(.*?)_,');
  var matches = slaveHashPattern.exec(masterHash);
  // fallback pattern to handle empty matches
  return (matches || [])[1]; // get first capturing group
}

// injectIntoMaster :: String -> String -> String
function injectIntoMaster(slaveHashId, newSlaveHash, masterHash) {

  var startDelimiter = '_' + slaveHashId + '.';
  var endDelimiter = '_,';

  var parts = masterHash.split(startDelimiter);
  var urlHead = parts[0];

  var urlTail = _fp2.default.compose([_fp2.default.split(endDelimiter), _fp2.default.tail, _fp2.default.join(endDelimiter)])(parts[1]);

  return urlHead + startDelimiter + (newSlaveHash || "") + endDelimiter // new encodede slave hash
  + urlTail;
}

// wrap :: String -> String
// converts some/route to #/some/route
function wrap(hashValue) {
  return "#" + (hashValue || "");
}

// unwrapHash :: String -> String
// converts someUrl.com/#/some/route to some/route
function unwrapHash(url) {
  return url.split('#')[1];
}
module.exports = exports['default'];

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = bootstrap;

var _fp = __webpack_require__(0);

var _fp2 = _interopRequireDefault(_fp);

var _logic = __webpack_require__(1);

var _logic2 = _interopRequireDefault(_logic);

var _toArray = __webpack_require__(3);

var _toArray2 = _interopRequireDefault(_toArray);

var _generateHash = __webpack_require__(4);

var _generateHash2 = _interopRequireDefault(_generateHash);

var _extractRoutes = __webpack_require__(5);

var extract = _interopRequireWildcard(_extractRoutes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function bootstrap() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$context = _ref.context,
      context = _ref$context === undefined ? window : _ref$context,
      _ref$id = _ref.id,
      id = _ref$id === undefined ? function (iframe) {
    return iframe.id;
  } : _ref$id,
      _ref$selector = _ref.selector,
      selector = _ref$selector === undefined ? 'iframe' : _ref$selector;

  // POLYFILLS
  // Required if the browser does not support startsWith natively
  // Source: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith#Polyfill
  if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (searchString, position) {
      position = position || 0;
      return this.substr(position, searchString.length) === searchString;
    };
  }

  // GENERAL UTILITY FUNCTIONS
  // getElements :: String -> NodeList HTMLElement
  var getElementsFrom = function getElementsFrom(source) {
    return source.querySelectorAll.bind(source);
  };

  // FUNCTION SHARED BETWEEN SINGLE & MULTI USE CASE
  // getIframesBySelector :: String -> getIframes
  // Returns a function that collects all iframes that also match the given selector.
  // Note: Maybe this could be improved by combining the 'iframe' part to the given selector string.
  // We could then omit F.filter from the source code (maybe)
  var getIframesBySelector = function getIframesBySelector(context, source, selector) {
    return function () {
      return _fp2.default.compose([getElementsFrom(source), _toArray2.default, _fp2.default.filter(function (x) {
        return x.tagName === "IFRAME";
      })])(selector);
    };
  };

  // getIframes :: Void -> Array iframe
  var getIframes = getIframesBySelector(context, context.document, selector);

  var matchedBySelector = function matchedBySelector(iframe) {
    return iframe.parentElement ? getIframesBySelector(context, iframe.parentElement, selector)().indexOf(iframe) !== -1
    // if the iframe has no parentElement, it's not attached.
    : false;
  };

  // OBSERVE ADDITIONS & REMOVEALS OF IFRAMES
  var obs = new MutationObserver(function (mutations) {
    // 1. handle additions
    // filter mutations
    _fp2.default.compose([
    // get all dom nodes added in the event
    _fp2.default.map(function (mutation) {
      return (0, _toArray2.default)(mutation.addedNodes);
    }), _fp2.default.flatten, _fp2.default.filter(matchedBySelector), _fp2.default.map(function (iframe) {
      bindRouting(iframe);
    })])(mutations);

    // 2. handle removals
    // filter mutations
    _fp2.default.compose([
    // get all dom nodes removed in the event
    _fp2.default.map(function (mutation) {
      return (0, _toArray2.default)(mutation.removedNodes);
    }), _fp2.default.flatten, _fp2.default.map(function (iframe) {
      undbindRouting(iframe);
    })])(mutations);
  });

  obs.observe(context.document.querySelector('body'), { childList: true });

  // injectHash :: Array String -> Array iframes -> Effect Array iframes
  var injectHash = function injectHash(hash) {
    return function (iframe) {
      var wrappedHash = _logic2.default.wrap(hash);
      // Re-inject after 'load' event
      iframe.contentWindow.location.hash = hash;
      iframe.addEventListener('load', function () {
        iframe.contentWindow.location.hash = hash;
      });
    };
  };

  // INITIALIZE the iframes with the correct hashes
  // IIFE
  // Route :: { id: String, value: String}
  // injectRoutes :: [Route] -> [iframe] -> [Effect Iframe]
  function injectRoutes(routes, iframes) {
    // if there are multiple routes, inject into iframes by matching the ID
    if (routes.length > 1 && iframes.length > 1) {
      _fp2.default.map(function (route) {
        _fp2.default.map(function (iframe) {
          if (route.id === id(iframe)) {
            injectHash(route.value)(iframe);
          }
        })(iframes);
      })(routes);
      // otherwise, inject the default route into all iframes
    } else if (routes.length === 1 && (routes[0] || {}).id === 'default') {
      _fp2.default.map(function (iframe) {
        injectHash(routes[0].value)(iframe);
      })(iframes);
    }
  }

  injectRoutes(extract.fromHash(context.location.hash), getIframes());

  // SYNCHRONIZE iframes with context
  // UPSTREAM
  // updateLocation :: Event -> Effect context
  var updateLocation = function updateLocation() {
    var newHash = (0, _generateHash2.default)(id)(getIframes());
    // silently changing context hash (replaceState won't trigger 'hashchange' nor adds to history length)
    return context.history.replaceState(null, '', newHash);
  };

  // bindRouting :: iframe -> subscribe iframe
  var bindRouting = function bindRouting(iframe) {
    iframe.addEventListener('load', function () {
      iframe.contentWindow.addEventListener('hashchange', updateLocation);
    });
  };

  // undbindRouting :: iframe -> unsubscribe iframe
  var undbindRouting = function undbindRouting(iframe) {
    iframe.addEventListener('load', function () {
      iframe.contentWindow.removeEventListener('hashchange', updateLocation);
    });
  };

  _fp2.default.map(bindRouting)(getIframes());

  function injectNewHashes(ev) {
    var newRoutes = extract.fromHash(ev.target.location.hash);
    var injectRoute = function injectRoute(route, iframe) {
      return iframe ? iframe.contentWindow.location.hash = _logic2.default.wrap(route.value) : 'noop';
    };
    _fp2.default.map2(injectRoute)(newRoutes)(getIframes());
  }

  // DOWNSTREAM
  context.addEventListener('hashchange', injectNewHashes);
} // iframeHashManager
// Synchronize the window location hash with that of iframes in the page. Useful for multiple SPAs on one site.

// Note on the bootstrap logic
// Because the event listeners get detached on load, a special procedure is required
// 1. wait for all the iframes to load
// 2. re-attach the event listeners for hash change onto the iframe

module.exports = exports['default'];

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
// toArray :: ArrayLike a -> Array HTMLElement
// Used to convert DomNodeList to Array
// Source: http://stackoverflow.com/questions/36810940/array-from-on-the-internet-explorer
var toArray = Array.from ? Array.from.bind(Array) : function from(arrayLike) {
  // 1. Let C be the this value.
  var toStr = Object.prototype.toString;
  var isCallable = function isCallable(fn) {
    return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
  };
  var toInteger = function toInteger(value) {
    var number = Number(value);
    if (isNaN(number)) {
      return 0;
    }
    if (number === 0 || !isFinite(number)) {
      return number;
    }
    return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
  };
  var maxSafeInteger = Math.pow(2, 53) - 1;
  var toLength = function toLength(value) {
    var len = toInteger(value);
    return Math.min(Math.max(len, 0), maxSafeInteger);
  };
  var C = this;

  // 2. Let items be ToObject(arrayLike).
  var items = Object(arrayLike);

  // 3. ReturnIfAbrupt(items).
  if (arrayLike == null) {
    throw new TypeError('Array.from requires an array-like object - not null or undefined');
  }

  // 4. If mapfn is undefined, then let mapping be false.
  var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
  var T;
  if (typeof mapFn !== 'undefined') {
    // 5. else
    // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
    if (!isCallable(mapFn)) {
      throw new TypeError('Array.from: when provided, the second argument must be a function');
    }

    // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
    if (arguments.length > 2) {
      T = arguments[2];
    }
  }

  // 10. Let lenValue be Get(items, "length").
  // 11. Let len be ToLength(lenValue).
  var len = toLength(items.length);

  // 13. If IsConstructor(C) is true, then
  // 13. a. Let A be the result of calling the [[Construct]] internal method of C with an argument list containing the single item len.
  // 14. a. Else, Let A be ArrayCreate(len).
  var A = isCallable(C) ? Object(new C(len)) : new Array(len);

  // 16. Let k be 0.
  var k = 0;
  // 17. Repeat, while k < len… (also steps a - h)
  var kValue;
  while (k < len) {
    kValue = items[k];
    if (mapFn) {
      A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
    } else {
      A[k] = kValue;
    }
    k += 1;
  }
  // 18. Let putStatus be Put(A, "length", len, true).
  A.length = len;
  // 20. Return A.
  return A;
};

exports.default = toArray;
module.exports = exports['default'];

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fp = __webpack_require__(0);

var _fp2 = _interopRequireDefault(_fp);

var _logic = __webpack_require__(1);

var _logic2 = _interopRequireDefault(_logic);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// generateHash :: (iframe -> String) -> [iframe] -> String
exports.default = function (id) {
  return function (iframes) {

    var encodeIframeRoute = function encodeIframeRoute(iframe) {
      return '_' + id(iframe) + '.' + (_logic2.default.unwrapHash(iframe.contentWindow.location.hash) || '') + '_,';
    };

    var generateHashFromMultiple = _fp2.default.compose([_fp2.default.map(encodeIframeRoute), _fp2.default.join(''), function (str) {
      return '#multi/' + str;
    }]);

    if (iframes.length === 1) {
      return iframes[0].contentWindow.location.hash;
    } else if (iframes.length > 1) {
      return generateHashFromMultiple(iframes);
    } else {
      return undefined;
    }
  };
};

module.exports = exports['default'];

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromHash = exports.fromIframes = undefined;

var _fp = __webpack_require__(0);

var _fp2 = _interopRequireDefault(_fp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fromIframes = function fromIframes(id) {
  return function () {
    var iframes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    return _fp2.default.map(function (iframe) {
      return {
        id: id(iframe),
        value: iframe.el.contentWindow.location.hash
      };
    })(iframes);
  };
};

// matchRoute :: String -> Object
// extractRoutes
// this module handles extracting the state from both url and iframes
var matchRoute = function matchRoute(string) {
  var r = new RegExp('([a-z]*)');
  var parts = string.split('.');
  return {
    id: parts[0].replace('_', ''),
    value: parts[1]
  };
};

// fromHash :: String -> [Object]
function fromHash() {
  var hash = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  if (hash.startsWith('#multi/')) {
    var parts = (hash.split('multi/')[1] || '').split('_,').slice(0, -1);

    return _fp2.default.map(matchRoute)(parts);
  } else if (hash.startsWith('#')) {
    return [{
      id: 'default',
      value: hash.split('#')[1]
    }];
  } else {
    return [];
  }
}

exports.fromIframes = fromIframes;
exports.fromHash = fromHash;

/***/ })
/******/ ]);
});