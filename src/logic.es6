// logic.js
// This file contains all the logic functions required for managing hashes
// This means none of these pure functions have any side effect or depenency on window etc.

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
function wrap (hashValue) { return "#" + ( hashValue || "" ) }

// unwrapHash :: String -> String
// converts someUrl.com/#/some/route to some/route
function unwrapHash (url) { return url.split('#')[1]}
