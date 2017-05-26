// extractRoutes
// this module handles extracting the state from both url and iframes
import F from './fp'

const fromIframes = id => (iframes = []) => {
  return F.map( iframe => ({
    id: id(iframe),
    value: iframe.el.contentWindow.location.hash
  }))(iframes)
}

// matchRoute :: String -> Object
const matchRoute = string => {
  const r = new RegExp('([a-z]*)')
  const parts = string.split('.')
  return {
      id: parts[0].replace('_', ''),
      value: parts[1],
  }
}

// fromHash :: String -> [Object]
function fromHash (hash = '') {
  if (hash.startsWith('#multi/')) {
    const parts = (hash.split('multi/')[1] || '')
      .split('_,')
      .slice(0, -1)

    return F.map(matchRoute)(parts)
  } else if (hash.startsWith('#/')) {
    return [{
      id: 'default',
      value: hash.split('#/')[1]
    }]
  } else {
    return []
  }

}

export { fromIframes, fromHash }
