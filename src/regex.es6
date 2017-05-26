const multiHash = '#multi/app.active_,_app2.completed_,_app3._,'
const singleHash = '#/whateverPath'
const logic = require('./logic')

// extractHashes :: String -> [String]
extractHashes = hash => {
  if ( hash.startsWith('#multi') ) {
  } else {
    return [
      logic.unwrapHash(hash)
    ]
  }
}
