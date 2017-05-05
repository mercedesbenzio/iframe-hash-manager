// logic.js
// This file contains all the logic functions that are testable
// This means none of these pure functions have any side effect on window etc.

import F from './fp'
export default {extractFromMaster, injectIntoMaster, wrap, unwrapHash}

// extractFromMaster :: String -> String -> String
function extractFromMaster( slaveHashId, masterHash ) {
  // delimiters are hard-coded: _[id]. and _,
  const slaveHashPattern = new RegExp( `_${slaveHashId}\.(.*?)_,` )
  const matches = slaveHashPattern.exec(masterHash)
  // fallback pattern to handle empty matches
  return (matches || [])[1] // get first capturing group
}


// injectIntoMaster :: String -> String -> String
function injectIntoMaster(slaveHashId, newSlaveHash, masterHash) {

  const startDelimiter = `_${slaveHashId}.`
  const endDelimiter = '_,'

  const parts = masterHash.split(startDelimiter)
  const urlHead = parts[0]

  // just remove the rest of the
  const urlTail = F.compose([
    F.split(endDelimiter),
    F.tail,
    F.join(endDelimiter)
  ])(parts[1])

  return urlHead
       + startDelimiter + (newSlaveHash || "") + endDelimiter // new encodede slave hash
       + urlTail
}

// wrap :: String -> String
// converts some/route to #/some/route
function wrap (hashValue) { return "#/" + ( hashValue || "" ) }

// unwrapHash :: String -> String
// converts someUrl.com/#/some/route to some/route
function unwrapHash (url) { return url.split('#/')[1]}
