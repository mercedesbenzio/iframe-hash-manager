/******/ (function(modules) { // webpackBootstrap
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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _fp = __webpack_require__(1);

var _fp2 = _interopRequireDefault(_fp);

var _logic = __webpack_require__(2);

var _logic2 = _interopRequireDefault(_logic);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// URL format
// iframeHashManager
// This module can be transpiled to ES5 and included as-is without any additional initialization code
// To manage the hashes in the Onweb multiple-spa iframe concept
// It currently supports
// - extracting the initial state of the apps from the URL and injecting it into the iframes
//   if no hash was fonud in the master URL, an initial URL will be generated based on the iframes on the site
// - keeping the hash of the master window up-to-date with the hashes of individual iframes
// TODO
// - mirroring the URL if a single iFrame is used.

(function iframeHashManager(window) {
  // writeToLocation :: String -> Effect window.location
  function writeToLocation(hash) {
    history.pushState({}, document.title || "Mercedes Benz", hash);
  };

  // handleSlaveHashChangeFor :: HTMLIFrameElement -> Event hashchange -> Effect window.location
  var handleSlaveHashChangeFor = function handleSlaveHashChangeFor(iframe) {
    return function (ev) {
      var hash = _logic2.default.unwrapHash(ev.newURL);
      var appId = iframe.id;

      writeToLocation(_logic2.default.injectIntoMaster(appId, hash, window.location.hash));
    };
  };

  // getIframes :: Void -> Array iframe
  function getIframes() {
    return Array.from(window.document.getElementsByTagName('iframe'));
  }

  // INTEGRATION
  // Because the event listeners get detached on load, a special procedure is required
  // 1. wait for all the iframes to load
  // 2. re-attach the event listeners for hash change onto the iframe
  function INTEGRATE() {

    // bindRouting :: iframe -> Int -> Effect iframe
    function bindRouting(iframe, index) {
      iframe.addEventListener('load', function () {
        attachListenerToiframe(index, 'hashchange', handleSlaveHashChangeFor(iframe));
      });
      return iframe;
    }

    // attachListenerToiframe :: iframe -> Int -> Effect iframe
    function attachListenerToiframe(iframeIndex, eventId, handler) {
      getIframes()[iframeIndex].contentWindow.addEventListener(eventId, handler);
    }

    // iframes :: Array iframe
    var iframes = getIframes();

    // setDefaultHash :: Array iframe -> Effect window.location
    var setDefaultHashFrom = _fp2.default.compose([_fp2.default.log('iframes'), _fp2.default.map(createSingleSlaveSkeleton), _fp2.default.log('skeleton'), _fp2.default.join(''), _logic2.default.wrap, writeToLocation]);

    // extractHashesFor :: Array iframes -> String -> Array String
    var extractHashesFor = function extractHashesFor(masterHash) {
      return function (iframes) {
        var ids = map(function (iframe) {
          return iframe.id;
        })(iframes);
        return map(function (id) {
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
      return '_' + iframe.id + '._,';
    }

    // injectAfterLoad :: Array String -> Array iframes -> Effect Array iframes
    var injectAfterLoad = function injectAfterLoad(hash, iframe, index) {
      iframe.addEventListener('load', function () {
        getIframes()[index].contentWindow.location.hash = hash;
      });
    };

    if (window.location.hash === "") {
      console.log(iframes);
      setDefaultHashFrom(iframes);
    } else {
      var restoredHashes = extractHashesFor(location.hash)(iframes);
      _fp2.default.map2(injectAfterLoad)(restoredHashes)(iframes);
    }
    _fp2.default.map(bindRouting)(iframes);
  }

  if (getIframes().length > 1) INTEGRATE();
})(window);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
// FP Primitive helpers
// compose :: List (a -> b) -> (a -> b)
var compose = function compose(functions) {
  return function (initial) {
    console.log(functions);functions.reverse().reduceRight(function (result, fn) {
      return fn(result);
    }, initial);
  };
};

// map :: (a -> b) -> Array a -> Array b
var map = function map(fn) {
  return function (arr) {
    return arr.map(fn);
  };
};

// map :: (a -> b -> c) -> Array a -> Array b -> Array c
var map2 = function map2(fn) {
  return function (arr1) {
    return function (arr2) {
      return arr1.map(function (el, index) {
        return fn(el, arr2[index], index);
      });
    };
  };
};

// join :: Array String -> String
var join = function join(delimiter) {
  return function (arr) {
    return arr.join(delimiter);
  };
};

// log :: a -> a
var log = function log(tag) {
  return function (data) {
    console.dir(tag, data);return data;
  };
};

// tail :: Array a -> Array (Maybe a)
var tail = function tail(arr) {
  return arr.slice(1, arr.length);
};

// split :: String -> Array String
var split = function split(delim) {
  return function (str) {
    return str.split(delim);
  };
};

exports.default = { compose: compose, map: map, map2: map2, join: join, log: log, tail: tail, split: split };

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fp = __webpack_require__(1);

var _fp2 = _interopRequireDefault(_fp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = { extractFromMaster: extractFromMaster, injectIntoMaster: injectIntoMaster, wrap: wrap, unwrapHash: unwrapHash };

// extractFromMaster :: String -> String -> String
// logic.js
// This file contains all the logic functions that are testable
// This means none of these pure functions have any side effect on window etc.

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

  // just remove the rest of the
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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(0);
module.exports = __webpack_require__(0);


/***/ })
/******/ ]);