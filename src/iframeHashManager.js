// iframeHashManager
// Synchronize the window location hash with that of iframes in the page. Useful for multiple SPAs on one site.

// Note on the bootstrap logic
// Because the event listeners get detached on load, a special procedure is required
// 1. wait for all the iframes to load
// 2. re-attach the event listeners for hash change onto the iframe

import F from './fp'
import logic from './logic.js'
import toArray from './toArray.js'

// GENERAL UTILITY FUNCTIONS
// getElements :: String -> NodeList HTMLElement
const getElementsFrom = source => source.querySelectorAll.bind(source)

export default function bootstrap ({
    // defaults
    context = window,
    id = iframe => iframe.id,
    selector = 'iframe'
  } = {}) {



  // FUNCTION SHARED BETWEEN SINGLE & MULTI USE CASE
  // getIframesBySelector :: String -> getIframes
  // Returns a function that collects all iframes that also match the given selector.
  // Note: Maybe this could be improved by combining the 'iframe' part to the given selector string.
  // We could then omit F.filter from the source code (maybe)
  const getIframesBySelector = (context, selector) => () => F.compose([
    getElementsFrom(context.document),
    toArray,
    F.filter(x => x.tagName === "IFRAME")
  ])(selector)

  // getIframes :: Void -> Array iframe
  const getIframes = getIframesBySelector(context, selector)
  const iframes = getIframes()

  // writeToLocation :: String -> Effect context.location
  function writeToLocation (hash) {
    history.pushState({}, context.document.title, hash);
  };

  // injectAfterLoad :: Array String -> Array iframes -> Effect Array iframes
  const injectAfterLoad = (hash, iframe, index) => {
    iframe.addEventListener('load', function () {
      iframe.contentWindow.location.hash = hash
    })
  }

  // bindRouting :: iframe -> Int -> Effect iframe
  const bindRouting = handler => (iframe, index) => {
    iframe.addEventListener('load', function () {
      iframe.contentWindow.addEventListener('hashchange', handler(iframe))
    })
    return iframe
  }




  // FUNCTIONS FOR A SINGLE IFRAME
  // handleSlaveHashChangeFor :: () -> Event hashchange -> Effect context.location
  const handleSingleSlaveHashChange = () => ev => F.compose([
      logic.unwrapHash,
      logic.wrap,
      writeToLocation
    ])(ev.target.location.href)

  // FUNCTIONS FOR MULTIPLE IFRAMES
  // setDefaultHash :: Array iframe -> Effect context.location
  const setDefaultHashFrom = F.compose([
    F.map(createSingleSlaveSkeleton),
    F.join(''),
    logic.wrap,
    writeToLocation
  ])

  // handleSlaveHashChangeFor :: HTMLIFrameElement -> Event hashchange -> Effect context.location
  const handleSlaveHashChangeFor = iframe => ev => {
    const hash = logic.unwrapHash(ev.newURL)
    const appId = id(iframe)

    writeToLocation(logic.injectIntoMaster(appId, hash, context.location.hash))
  }


  // extractHashesFor :: Array iframes -> String -> Array String
  const extractHashesFor = masterHash => iframes => {
    var ids = F.map(id)(iframes)
    return F.map(id => logic.extractFromMaster(id, masterHash))(ids)
  }

  // setHashFor :: iframe -> String -> Effect iframe
  const setHashFor = iframe => hash => { iframe.contentWindow.location.hash = hash; return iframe }

  // createSingleSlaveSkeleton :: iframe -> String
  function createSingleSlaveSkeleton (iframe) {
    return `_${id(iframe)}._,`
  }

  function init () {

    function initOne(iframes) {
      if (context.location.hash !== "") {
        F.map2(injectAfterLoad)([location.hash])(iframes)
      }
      F.map(bindRouting(handleSingleSlaveHashChange))(iframes)
    }

    function initMulti(iframes) {
      // just overwrite undefined or empty master hash
      if (logic.unwrapHash(context.location.hash) === "" || !context.location.hash) {
        setDefaultHashFrom(iframes)
      } else {
        // otherwise, restore from master
        const restoredHashes = extractHashesFor(location.hash)(iframes)
        F.map2(injectAfterLoad)(restoredHashes)(iframes)
      }
      F.map(bindRouting(handleSlaveHashChangeFor))(iframes)
    }

    // iframes :: Array iframe
    iframes.length > 1 ? initMulti(iframes) : initOne(iframes)
  }

  init()

}
