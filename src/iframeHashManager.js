// iframeHashManager
// Synchronize the window location hash with that of iframes in the page. Useful for multiple SPAs on one site.

// Note on the bootstrap logic
// Because the event listeners get detached on load, a special procedure is required
// 1. wait for all the iframes to load
// 2. re-attach the event listeners for hash change onto the iframe

import F            from './fp'
import logic        from './logic'
import toArray      from './toArray'
import generateHash from './generateHash'
import * as extract from './extractRoutes.js'

// GENERAL UTILITY FUNCTIONS
// getElements :: String -> NodeList HTMLElement
const getElementsFrom = source => source.querySelectorAll.bind(source)

export default function bootstrap ({
    // defaults
    context = window,
    id = iframe => iframe.id,
    selector = 'iframe'
  } = {}) {

  // Iframe :: { el: HTMLIFrameElement, bound: bool}
  const iframe = el => ({el: el, bound: false})

  // FUNCTION SHARED BETWEEN SINGLE & MULTI USE CASE
  // getIframesBySelector :: String -> getIframes
  // Returns a function that collects all iframes that also match the given selector.
  // Note: Maybe this could be improved by combining the 'iframe' part to the given selector string.
  // We could then omit F.filter from the source code (maybe)
  const getIframesBySelector = (context, selector) => () => F.compose([
    getElementsFrom(context.document),
    toArray,
    F.filter(x => x.tagName === "IFRAME"),
    F.map(iframe)
  ])(selector)


  // getIframes :: Void -> Array iframe
  const getIframes = getIframesBySelector(context, selector)

  const iframes = getIframes()
  const initialRoutes = extract.fromHash(context.location.hash)

  // injectAfterLoad :: Array String -> Array iframes -> Effect Array iframes
  const injectAfterLoad = (hash, iframe) => {
    iframe.addEventListener('load', function () {
      iframe.contentWindow.location.hash = hash
    })
  }

  // Route :: { id: String, value: String}

  // injectInitial :: initialRoutes -> [Route] -> [iframe]
  function injectInitial (routes, iframes) {
    // inject if there are multiple routes extracted by matching ID
    // NOTE: iframes inherit the hash by default.
    if ( (routes.length > 1) && (iframes.length > 1) ) {
      F.map( route => {
        F.map( iframe => {
          if ( route.id === id(iframe.el) ) {
            injectAfterLoad( logic.wrap(route.value), iframe.el )
          }
        })(iframes)
      })(routes)
    }
  }

  injectInitial(initialRoutes, iframes)

  // createHash :: () -> String
  // generates a hash based on the currently selected iframes
  const createHash = generateHash(id)(iframes)

  // writeToLocation :: String -> Effect context.location
  const writeToLocation = hash => history.pushState({}, context.document.title, hash)

  // bindRouting :: iframe -> Int -> Effect iframe
  const bindRouting = iframe => {
    iframe.el.addEventListener('load', function () {
      iframe.el.contentWindow.addEventListener(
        'hashchange',
        function (event) {
          const newHash = createHash()
          writeToLocation(newHash)
        }
      )
    })
    return iframe.el
  }

  F.map(bindRouting)(iframes)
}
