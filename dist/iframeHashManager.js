(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["iframeHashManager"] = factory();
	else
		root["iframeHashManager"] = factory();
})(this, function() {
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
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
/******/ 	__webpack_require__.p = "";
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

exports.default = { compose: compose, map: map, map2: map2, filter: filter, join: join, log: log, tail: tail, split: split };

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

exports.default = { extractFromMaster: extractFromMaster, injectIntoMaster: injectIntoMaster, wrap: wrap, unwrapHash: unwrapHash };

// extractFromMaster :: String -> String -> String
// logic.js
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
  return "#/" + (hashValue || "");
}

// unwrapHash :: String -> String
// converts someUrl.com/#/some/route to some/route
function unwrapHash(url) {
  return url.split('#/')[1];
}

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// GENERAL UTILITY FUNCTIONS
// getElements :: String -> NodeList HTMLElement
// iframeHashManager
// Synchronize the window location hash with that of iframes in the page. Useful for multiple SPAs on one site.

// Note on the bootstrap logic
// Because the event listeners get detached on load, a special procedure is required
// 1. wait for all the iframes to load
// 2. re-attach the event listeners for hash change onto the iframe

var getElements = window.document.querySelectorAll.bind(window.document);

// toArray :: NodeList HTMLElement -> Array HTMLElement
var toArray = Array.from.bind(Array);

// URL format
function bootstrap(window, options) {

  // defaults
  var selector = (options || {}).selector || 'iframe';
  var id = (options || {}).id || function (iframe) {
    return iframe.id;
  };

  // FUNCTION SHARED BETWEEN SINGLE & MULTI USE CASE
  // getIframesBySelector :: String -> getIframes
  // Returns a function that collects all iframes that also match the given selector.
  // Note: Maybe this could be improved by combining the 'iframe' part to the given selector string.
  // We could then omit F.filter from the source code (maybe)
  var getIframesBySelector = function getIframesBySelector(window, selector) {
    return function () {
      return _fp2.default.compose([getElements, toArray, _fp2.default.filter(function (x) {
        return x.tagName === "IFRAME";
      })])(selector);
    };
  };

  // getIframes :: Void -> Array iframe
  var getIframes = getIframesBySelector(window, selector);

  // writeToLocation :: String -> Effect window.location
  function writeToLocation(hash) {
    history.pushState({}, document.title || "Mercedes Benz", hash);
  };

  // attachListenerToiframe :: iframe -> Int -> Effect iframe
  function attachListenerToiframe(iframeIndex, eventId, handler) {
    getIframes()[iframeIndex].contentWindow.addEventListener(eventId, handler);
  }

  // injectAfterLoad :: Array String -> Array iframes -> Effect Array iframes
  var injectAfterLoad = function injectAfterLoad(hash, iframe, index) {
    iframe.addEventListener('load', function () {
      getIframes()[index].contentWindow.location.hash = hash;
    });
  };

  // bindRouting :: iframe -> Int -> Effect iframe
  var bindRouting = function bindRouting(handler) {
    return function (iframe, index) {
      iframe.addEventListener('load', function () {
        attachListenerToiframe(index, 'hashchange', handler(iframe));
      });
      return iframe;
    };
  };

  // FUNCTIONS FOR A SINGLE IFRAME
  // handleSlaveHashChangeFor :: () -> Event hashchange -> Effect window.location
  var handleSingleSlaveHashChange = function handleSingleSlaveHashChange() {
    return function (ev) {
      return _fp2.default.compose([_logic2.default.unwrapHash, _logic2.default.wrap, writeToLocation])(ev.newURL);
    };
  };

  // FUNCTIONS FOR MULTIPLE IFRAMES
  // setDefaultHash :: Array iframe -> Effect window.location
  var setDefaultHashFrom = _fp2.default.compose([_fp2.default.map(createSingleSlaveSkeleton), _fp2.default.join(''), _logic2.default.wrap, writeToLocation]);

  // handleSlaveHashChangeFor :: HTMLIFrameElement -> Event hashchange -> Effect window.location
  var handleSlaveHashChangeFor = function handleSlaveHashChangeFor(iframe) {
    return function (ev) {
      var hash = _logic2.default.unwrapHash(ev.newURL);
      var appId = id(iframe);

      writeToLocation(_logic2.default.injectIntoMaster(appId, hash, window.location.hash));
    };
  };

  // extractHashesFor :: Array iframes -> String -> Array String
  var extractHashesFor = function extractHashesFor(masterHash) {
    return function (iframes) {
      var ids = _fp2.default.map(id)(iframes);
      return _fp2.default.map(function (id) {
        return _logic2.default.extractFromMaster(id, masterHash);
      })(ids);
    };
  };

  // setHashFor :: iframe -> String -> Effect iframe
  var setHashFor = function setHashFor(iframe) {
    return function (hash) {
      iframe.contentWindow.location.hash = hash;return iframe;
    };
  };

  // createSingleSlaveSkeleton :: iframe -> String
  function createSingleSlaveSkeleton(iframe) {
    return '_' + id(iframe) + '._,';
  }

  function init() {

    function initOne(iframes) {
      if (window.location.hash !== "") {
        _fp2.default.map2(injectAfterLoad)([location.hash])(iframes);
      }
      _fp2.default.map(bindRouting(handleSingleSlaveHashChange))(iframes);
    }

    function initMulti(iframes) {
      // just overwrite undefined or empty master hash
      if (_logic2.default.unwrapHash(window.location.hash) === "" || !window.location.hash) {
        setDefaultHashFrom(iframes);
      } else {
        // otherwise, restore from master
        var restoredHashes = extractHashesFor(location.hash)(iframes);
        _fp2.default.map2(injectAfterLoad)(restoredHashes)(iframes);
      }
      _fp2.default.map(bindRouting(handleSlaveHashChangeFor))(iframes);
    }

    // iframes :: Array iframe
    var iframes = getIframes();
    iframes.length > 1 ? initMulti(iframes) : initOne(iframes);
  }

  init();
}

/***/ })
/******/ ]);
});