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
import * as extract from './extractRoutes'


export default function bootstrap ({
    // defaults
    context = window,
    id = iframe => iframe.id,
    selector = 'iframe'
  } = {}) {

  // POLYFILLS
  // Required if the browser does not support startsWith natively
  // Source: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith#Polyfill
  if (!String.prototype.startsWith) {
      String.prototype.startsWith = function(searchString, position){
        position = position || 0;
        return this.substr(position, searchString.length) === searchString;
    };
  }

  // GENERAL UTILITY FUNCTIONS
  // getElements :: String -> NodeList HTMLElement
  const getElementsFrom = source => source.querySelectorAll.bind(source)

  // FUNCTION SHARED BETWEEN SINGLE & MULTI USE CASE
  // getIframesBySelector :: String -> getIframes
  // Returns a function that collects all iframes that also match the given selector.
  // Note: Maybe this could be improved by combining the 'iframe' part to the given selector string.
  // We could then omit F.filter from the source code (maybe)
  const getIframesBySelector = (context, source, selector) => () => F.compose([
    getElementsFrom(source),
    toArray,
    F.filter(x => x.tagName === "IFRAME")
  ])(selector)


  // getIframes :: Void -> Array iframe
  const getIframes = getIframesBySelector(context, context.document, selector)

  // INITIALIZE
  const iframes = getIframes()
  const initialRoutes = extract.fromHash(context.location.hash)

  const matchedBySelector = iframe => iframe.parentElement
    ? getIframesBySelector(context, iframe.parentElement, selector)().indexOf(iframe) !== -1
    // if the iframe has no parentElement, it's not attached.
    : false

  // OBSERVE ADDITIONS & REMOVEALS OF IFRAMES
  const obs = new MutationObserver( mutations => {
    // 1. handle additions
    // filter mutations
    F.compose([
      // get all dom nodes added in the event
      F.map(mutation => toArray(mutation.addedNodes)),
      F.flatten,
      // decide if they should be added to our `iframes` array
      F.filter( matchedBySelector ),
      F.map(iframe => {
        bindRouting(iframe)
        iframes.push(iframe)
      })
    ])(mutations)

    // 1. handle removals
    // filter mutations
    F.compose([
      // get all dom nodes added in the event
      F.map(mutation => toArray(mutation.removedNodes)),
      F.flatten,
      // decide if they should be added to our `iframes` array
      F.map(iframe => {
        undbindRouting(iframe)
        // remove iframe from iframes
        iframes.splice(iframes.indexOf(iframe), 1)
      })
    ])(mutations)
  })

  obs.observe(context.document.querySelector('body'), {childList: true})

  // injectHash :: Array String -> Array iframes -> Effect Array iframes
  const injectHash = hash => iframe => {
    // Double inject required for some reason.
    iframe.contentWindow.location.hash = hash
    iframe.addEventListener('load', function () {
      iframe.contentWindow.location.hash = hash
    })
  }

  // Route :: { id: String, value: String}
  // injectInitial :: initialRoutes -> [Route] -> [iframe]
  function injectRoutes (routes, iframes) {
    // inject if there are multiple routes extracted by matching ID
    // NOTE: iframes inherit the hash by default.
    if ( (routes.length > 1) && (iframes.length > 1) ) {
      F.map( route => {
        F.map( iframe => {
          if ( route.id === id(iframe) ) {
            injectHash( logic.wrap(route.value) )( iframe )
          }
        })(iframes)
      })(routes)
    }
  }

  injectRoutes(initialRoutes, iframes)

  // SYNCHRONIZE

  // UPSTREAM
  // updateLocation :: (IFrameDOMElement -> String) -> Array IFrameDOMElement -> Effect context
  const updateLocation = () => history.pushState({}, context.document.title, generateHash(id)(iframes)())

  // bindRouting :: iframe -> Effect iframe
  const bindRouting = iframe => {
    iframe.addEventListener('load', function () {
      iframe.contentWindow.addEventListener( 'hashchange', updateLocation )
    })
  }

  // bindRouting :: iframe -> Effect iframe
  const undbindRouting = iframe => {
    iframe.addEventListener('load', function () {
      iframe.contentWindow.removeEventListener( 'hashchange', updateLocation )
    })
  }

  F.map(bindRouting)(iframes)

  // DOWNSTREAM
  context.addEventListener( 'hashchange', ev => {
    const newRoutes = extract.fromHash(ev.target.location.hash)
    const injectRoute = (route, iframe) => iframe.contentWindow.location.hash = logic.wrap(route.value)
    F.map2( injectRoute )(newRoutes)(iframes)
  })
}
